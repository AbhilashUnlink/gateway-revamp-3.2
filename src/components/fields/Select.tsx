import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Search, X } from 'lucide-react';
import type { FilterFieldOption } from '@/components/filter/types';

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: FilterFieldOption[];
  placeholder?: string;
  /** Option values that should appear greyed-out and unselectable. */
  disabledValues?: string[];
  /** Override classes on the trigger button (e.g. height/padding for forms). */
  triggerClassName?: string;
  /** Render an error border + focus ring. */
  invalid?: boolean;
  disabled?: boolean;
  id?: string;
}

interface MenuPosition {
  top: number;
  left: number;
  width: number;
}

const MENU_MAX_HEIGHT = 280;
const MENU_GAP = 4;

export function Select({
  value,
  onChange,
  options,
  placeholder,
  disabledValues = [],
  triggerClassName,
  invalid,
  disabled,
  id,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [menuPos, setMenuPos] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const closeMenu = () => {
    setOpen(false);
    setQuery('');
  };

  const labelByValue = useMemo(() => {
    const map = new Map<string, string>();
    for (const o of options) map.set(o.value, o.label);
    return map;
  }, [options]);

  const visibleOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.value.toLowerCase().includes(q)
    );
  }, [options, query]);

  const showSearch = options.length > 0;
  const disabledSet = useMemo(() => new Set(disabledValues), [disabledValues]);

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

  useEffect(() => {
    if (!open || !showSearch) return;
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

  const select = (v: string) => {
    if (disabledSet.has(v)) return;
    onChange(v);
    closeMenu();
  };

  const currentLabel = value ? (labelByValue.get(value) ?? value) : '';

  return (
    <div className="relative w-full">
      <button
        ref={triggerRef}
        id={id}
        type="button"
        disabled={disabled}
        title={currentLabel || undefined}
        onClick={() => (open ? closeMenu() : setOpen(true))}
        className={[
          'flex w-full items-center gap-2 overflow-hidden rounded-lg border bg-white text-sm text-[#1a1a1a] outline-none disabled:cursor-not-allowed disabled:bg-[#fafafa]',
          invalid
            ? 'border-red-400 focus:ring-1 focus:ring-red-300/40'
            : 'border-[#e5e5e5] focus:ring-1 focus:ring-[#f7941d]',
          triggerClassName ?? 'h-10 px-3',
        ].join(' ')}
      >
        <span className={`min-w-0 flex-1 truncate text-left ${value ? '' : 'text-[#808080]'}`}>
          {currentLabel || placeholder || 'Select…'}
        </span>
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
              {visibleOptions.map((o) => {
                const isDisabled = disabledSet.has(o.value);
                const isCurrent = o.value === value;
                return (
                  <button
                    key={o.value}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => select(o.value)}
                    className={[
                      'flex w-full items-center justify-between gap-2 px-3 py-1.5 text-left text-sm',
                      isDisabled
                        ? 'cursor-not-allowed text-[#bdbdbd]'
                        : 'cursor-pointer text-[#1a1a1a] hover:bg-[#fafafa]',
                      isCurrent && !isDisabled ? 'bg-[#fafafa] font-medium' : '',
                    ].join(' ')}
                  >
                    <span className="truncate">{o.label}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
