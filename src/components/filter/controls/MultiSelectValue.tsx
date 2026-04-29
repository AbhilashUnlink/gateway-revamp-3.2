import { useState, useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import type { FilterFieldOption } from '../types';

interface Props {
  value: string[];
  onChange: (v: string[]) => void;
  options: FilterFieldOption[];
  placeholder?: string;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

const MENU_MAX_HEIGHT = 280;
const MENU_GAP = 4;
const MAX_VISIBLE_TAGS = 2;
const SEARCH_THRESHOLD = 6; // show search input only when more than N options

export function MultiSelectValue({ value, onChange, options, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  // Defensive: persisted state from a previous schema (e.g. when this field
  // was `text` before the change to `multiSelect`) can leave a non-array value
  // here, which would crash on `.map`. Coerce to [] in that case.
  const selected = useMemo(() => (Array.isArray(value) ? value : []), [value]);

  const closeMenu = () => {
    setOpen(false);
    setQuery('');
  };

  const labelByValue = useMemo(() => {
    const map = new Map<string, string>();
    for (const o of options) map.set(o.value, o.label);
    return map;
  }, [options]);

  // Selected items pinned to the top of the menu list, in original option order.
  const sortedOptions = useMemo(() => {
    if (selected.length === 0) return options;
    const selectedSet = new Set(selected);
    const top = options.filter((o) => selectedSet.has(o.value));
    const rest = options.filter((o) => !selectedSet.has(o.value));
    return [...top, ...rest];
  }, [options, selected]);

  // Filter by search query (case-insensitive, matches label or value).
  const visibleOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sortedOptions;
    return sortedOptions.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [sortedOptions, query]);

  const showSearch = options.length > SEARCH_THRESHOLD;

  // Position the portaled menu relative to the trigger; flip above if no room below.
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const t = triggerRef.current?.getBoundingClientRect();
      if (!t) return;
      const spaceBelow = window.innerHeight - t.bottom - MENU_GAP;
      const flip = spaceBelow < 160 && t.top > spaceBelow;
      const top = flip
        ? Math.max(8, t.top - MENU_GAP - Math.min(MENU_MAX_HEIGHT, t.top - 16))
        : t.bottom + MENU_GAP;
      setMenuPos({ top, left: t.left, width: t.width });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open]);

  // Focus search input when menu opens.
  useEffect(() => {
    if (!open || !showSearch) return;
    // Defer to next frame so the portaled element is in the DOM.
    const id = requestAnimationFrame(() => searchRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, showSearch]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      closeMenu();
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v]);
  };

  // Truncated summary text: "A, B +3 more"
  const labelForValue = (v: string) => labelByValue.get(v) ?? v;
  const fullList = selected.map(labelForValue).join(', ');
  const visibleTags = selected.slice(0, MAX_VISIBLE_TAGS).map(labelForValue);
  const overflowCount = Math.max(0, selected.length - MAX_VISIBLE_TAGS);

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        type="button"
        title={selected.length > 0 ? fullList : undefined}
        onClick={() => (open ? closeMenu() : setOpen(true))}
        className="flex h-10 w-full items-center gap-2 overflow-hidden rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a]"
      >
        <div className="flex min-w-0 flex-1 items-center gap-1 overflow-hidden whitespace-nowrap">
          {selected.length === 0 ? (
            <span className="text-[#808080]">{placeholder ?? 'Select…'}</span>
          ) : (
            <>
              <span className="min-w-0 flex-1 truncate text-left">{visibleTags.join(', ')}</span>
              {overflowCount > 0 && (
                <span className="shrink-0 rounded bg-[#f5f5f5] px-1.5 py-0.5 text-xs font-medium text-[#1a1a1a]">
                  +{overflowCount} more
                </span>
              )}
            </>
          )}
        </div>
        <ChevronDown size={16} className="shrink-0 text-[#808080]" />
      </button>

      {open &&
        menuPos &&
        createPortal(
          <div
            ref={menuRef}
            data-filter-portal="true"
            className="fixed flex flex-col rounded-lg border border-[#e5e5e5] bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
            style={{
              top: menuPos.top,
              left: menuPos.left,
              width: menuPos.width,
              maxHeight: MENU_MAX_HEIGHT,
              zIndex: 1500,
            }}
          >
            {showSearch && (
              <div className="flex items-center gap-2 border-b border-[#f0f0f0] px-3 py-2">
                <Search size={14} className="shrink-0 text-[#808080]" />
                <input
                  ref={searchRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="h-7 min-w-0 flex-1 bg-transparent text-sm text-[#1a1a1a] outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => {
                      setQuery('');
                      searchRef.current?.focus();
                    }}
                    aria-label="Clear search"
                    className="shrink-0 text-[#808080] hover:text-[#1a1a1a]"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            )}

            <div className="overflow-auto py-1">
              {visibleOptions.length === 0 && (
                <div className="px-3 py-2 text-sm text-[#808080]">
                  {options.length === 0 ? 'No options' : 'No matches'}
                </div>
              )}
              {visibleOptions.map((o, i) => {
                const isSelected = selected.includes(o.value);
                const next = visibleOptions[i + 1];
                const isLastSelected = isSelected && next ? !selected.includes(next.value) : false;
                return (
                  <label
                    key={o.value}
                    className={`flex cursor-pointer items-center gap-2 px-3 py-1.5 text-sm hover:bg-[#fafafa] ${
                      isLastSelected ? 'border-b border-[#f0f0f0]' : ''
                    }`}
                  >
                    <input type="checkbox" checked={isSelected} onChange={() => toggle(o.value)} />
                    <span className="truncate">{o.label}</span>
                  </label>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
