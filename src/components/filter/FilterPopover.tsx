import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Plus, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addRule,
  applyFilters,
  closeFilter,
  removeRule,
  resetFilters,
  selectDraftRules,
  selectFilterIsOpen,
  updateRule,
  type FilterScreen,
} from '@/store/slices/filterSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';
import { FilterRuleRow } from './FilterRuleRow';
import { inferOperator } from './operators';
import type { FilterField } from './types';

interface Props {
  screen: FilterScreen;
  fields: FilterField[];
  /** Anchor element — popover positions itself just below + right-aligned. */
  anchorRef: RefObject<HTMLElement | null>;
}

const newId = () => `r_${Math.random().toString(36).slice(2, 10)}`;

export function FilterPopover({ screen, fields, anchorRef }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectFilterIsOpen(screen));
  const draftRules = useAppSelector(selectDraftRules(screen));
  const popRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);

  const POPOVER_WIDTH = 520;

  // Compute position from anchor element AFTER render. Re-runs on resize/scroll
  // so the popover stays glued to the button. When closed, the render guard
  // below returns null so stale position state is harmless.
  useLayoutEffect(() => {
    if (!isOpen) return;
    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPosition({
        top: rect.bottom + 8,
        left: Math.max(8, rect.right - POPOVER_WIDTH),
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [isOpen, anchorRef]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!isOpen) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      // Ignore clicks inside any child portal (e.g. multiSelect dropdown)
      // that lives outside the popover DOM tree.
      if (target instanceof Element && target.closest('[data-filter-portal="true"]')) return;
      dispatch(closeFilter(screen));
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(closeFilter(screen));
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [isOpen, anchorRef, dispatch, screen]);

  if (!isOpen || !position) return null;

  const handleAdd = () => {
    const firstFree = fields.find((f) => !draftRules.some((r) => r.field === f.id));
    if (!firstFree) return;
    const blank = firstFree.type === 'multiSelect' ? [] : firstFree.type === 'dateRange' ? {} : '';
    dispatch(
      addRule({
        screen,
        rule: {
          id: newId(),
          field: firstFree.id,
          operator: inferOperator(firstFree.type),
          value: blank,
        },
      })
    );
  };

  // Apply commits draft → applied in redux. The page-side effect keyed on
  // `appliedRules` triggers exactly one fetch with the new filters.
  const handleApply = () => dispatch(applyFilters(screen));
  const handleReset = () => dispatch(resetFilters(screen));

  const takenFieldIds = draftRules.map((r) => r.field).filter(Boolean);

  return createPortal(
    <div
      ref={popRef}
      className={cn(
        'fixed z-[60] flex max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]'
      )}
      style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
    >
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
        <h3 className="text-base font-semibold text-[#1a1a1a]">{t('filter.title', 'Filters')}</h3>
        <button
          type="button"
          onClick={() => dispatch(closeFilter(screen))}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#fafafa]"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-5 py-4">
        {draftRules.length === 0 && (
          <div className="rounded-lg bg-[#fafafa] px-4 py-6 text-center text-sm text-[#808080]">
            {t('filter.empty', 'No filters yet — add one to start.')}
          </div>
        )}
        {draftRules.map((rule) => (
          <FilterRuleRow
            key={rule.id}
            rule={rule}
            fields={fields}
            takenFieldIds={takenFieldIds}
            onChange={(patch) => dispatch(updateRule({ screen, id: rule.id, patch }))}
            onRemove={() => dispatch(removeRule({ screen, id: rule.id }))}
          />
        ))}

        <button
          type="button"
          onClick={handleAdd}
          className="mt-1 inline-flex items-center gap-2 self-start rounded-lg border border-dashed border-[#bdbdbd] px-3 py-2 text-sm font-medium text-[#1a1a1a] hover:bg-[#fafafa]"
        >
          <Plus size={16} />
          {t('filter.add_rule', 'Add filter')}
        </button>
      </div>

      <div className="flex justify-end gap-3 border-t border-[#f0f0f0] px-5 py-3">
        <Button type="button" variant="ghost" onClick={handleReset}>
          {t('filter.reset', 'Reset')}
        </Button>
        <Button type="button" onClick={handleApply}>
          {t('filter.apply', 'Apply')}
        </Button>
      </div>
    </div>,
    document.body
  );
}
