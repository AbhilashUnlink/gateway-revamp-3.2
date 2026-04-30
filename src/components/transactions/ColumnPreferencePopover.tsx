import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { GripVertical, RotateCcw, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  resetColumnPreference,
  selectColumnPreference,
  setColumnPreference,
} from '@/store/slices/columnPreferencesSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export interface ColumnPreferenceItem {
  id: string;
  /** Translation key for the column header. */
  labelKey: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  /** Stable screen key (e.g. 'transactions', 'merchants'). */
  screen: string;
  /** Full default list of columns for the screen, in canonical order. */
  defaultColumns: ColumnPreferenceItem[];
}

const POPOVER_WIDTH = 420;
const MENU_GAP = 8;

interface DraftItem extends ColumnPreferenceItem {
  visible: boolean;
}

/**
 * Build the draft list ordered like the saved preference (or the default
 * order if nothing's saved), with `visible` flipped per the saved hidden set.
 */
function buildDraft(
  defaultColumns: ColumnPreferenceItem[],
  order: string[],
  hidden: string[]
): DraftItem[] {
  const byId = new Map(defaultColumns.map((c) => [c.id, c]));
  const hiddenSet = new Set(hidden);
  const seen = new Set<string>();
  const out: DraftItem[] = [];

  for (const id of order) {
    if (seen.has(id)) continue;
    const col = byId.get(id);
    if (!col) continue;
    out.push({ ...col, visible: !hiddenSet.has(id) });
    seen.add(id);
  }
  for (const col of defaultColumns) {
    if (seen.has(col.id)) continue;
    out.push({ ...col, visible: !hiddenSet.has(col.id) });
  }
  return out;
}

export function ColumnPreferencePopover({
  open,
  onClose,
  anchorRef,
  screen,
  defaultColumns,
}: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const saved = useAppSelector(selectColumnPreference(screen));
  const popRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [draft, setDraft] = useState<DraftItem[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  // Position
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const r = anchorRef.current?.getBoundingClientRect();
      if (!r) return;
      setPosition({
        top: r.bottom + MENU_GAP,
        left: Math.max(8, r.right - POPOVER_WIDTH),
      });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef]);

  // Re-seed the draft from saved state whenever the popover opens.
  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(buildDraft(defaultColumns, saved.order, saved.hidden));
  }, [open, defaultColumns, saved.order, saved.hidden]);

  // Close on outside click / Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, anchorRef, onClose]);

  if (!open || !position) return null;

  const visibleCount = draft.filter((c) => c.visible).length;

  const toggle = (id: string) =>
    setDraft((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));

  // ── Drag & drop ────────────────────────────────────────────────────────
  // Native HTML5 DnD — no third-party libs. The drop "slot" is between rows;
  // dropIndex 0 means "drop above the first row", dropIndex N means "drop
  // after the last row".
  const handleDragStart = (index: number, e: React.DragEvent) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox to start the drag.
    e.dataTransfer.setData('text/plain', String(index));
  };

  const handleDragOver = (index: number, e: React.DragEvent) => {
    if (dragIndex === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const after = e.clientY - rect.top > rect.height / 2;
    setDropIndex(after ? index + 1 : index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDraft((prev) => {
      if (dragIndex === null || dropIndex === null) return prev;
      let target = dropIndex;
      // When moving down, removing the source first shifts the target left by 1.
      if (target > dragIndex) target -= 1;
      if (target === dragIndex) return prev;
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(target, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleListDragOver = (e: React.DragEvent) => {
    if (dragIndex === null) return;
    e.preventDefault();
  };

  // Drop after the last row when dropping in the empty space at the bottom.
  const handleListDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (dragIndex === null) return;
    setDraft((prev) => {
      let target = dropIndex ?? prev.length;
      if (target > dragIndex) target -= 1;
      if (target === dragIndex) return prev;
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(target, 0, moved);
      return next;
    });
    setDragIndex(null);
    setDropIndex(null);
  };

  const handleApply = () => {
    dispatch(
      setColumnPreference({
        screen,
        preference: {
          order: draft.map((c) => c.id),
          hidden: draft.filter((c) => !c.visible).map((c) => c.id),
        },
      })
    );
    onClose();
  };

  const handleReset = () => {
    dispatch(resetColumnPreference(screen));
    setDraft(buildDraft(defaultColumns, [], []));
  };

  const showAll = () => setDraft((prev) => prev.map((c) => ({ ...c, visible: true })));
  const hideAll = () => setDraft((prev) => prev.map((c) => ({ ...c, visible: false })));

  return createPortal(
    <div
      ref={popRef}
      className={cn(
        'fixed z-[60] flex max-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]'
      )}
      style={{ top: position.top, left: position.left, width: POPOVER_WIDTH }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#f0f0f0] px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-[#1a1a1a]">
            {t('columns.title', 'Column preferences')}
          </h3>
          <div className="mt-0.5 text-xs text-[#808080]">
            {t('columns.visible_count', '{{visible}} of {{total}} visible', {
              visible: visibleCount,
              total: draft.length,
            })}
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#fafafa]"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </div>

      {/* Quick actions */}
      <div className="flex items-center gap-2 border-b border-[#f0f0f0] bg-[#fafafa] px-5 py-2">
        <button
          type="button"
          onClick={showAll}
          className="text-xs font-medium text-[#1a1a1a] hover:text-[#f7941d]"
        >
          {t('columns.show_all', 'Show all')}
        </button>
        <span className="text-[#bdbdbd]">·</span>
        <button
          type="button"
          onClick={hideAll}
          className="text-xs font-medium text-[#1a1a1a] hover:text-[#f7941d]"
        >
          {t('columns.hide_all', 'Hide all')}
        </button>
        <div className="ml-auto" />
        <button
          type="button"
          onClick={handleReset}
          title={t('columns.reset_default', 'Restore default order & visibility')}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#808080] hover:text-[#1a1a1a]"
        >
          <RotateCcw size={12} />
          {t('columns.default', 'Default')}
        </button>
      </div>

      {/* List */}
      <div
        className="flex-1 overflow-y-auto px-3 py-2"
        onDragOver={handleListDragOver}
        onDrop={handleListDrop}
      >
        {draft.map((col, idx) => {
          const isDragging = dragIndex === idx;
          const showTopIndicator = dropIndex === idx && dragIndex !== null && dragIndex !== idx;
          const showBottomIndicator =
            dropIndex === idx + 1 &&
            dragIndex !== null &&
            dragIndex !== idx &&
            dragIndex !== idx + 1;
          return (
            <div key={col.id} className="relative">
              {showTopIndicator && (
                <div className="pointer-events-none absolute -top-0.5 left-2 right-2 h-0.5 rounded-full bg-[#f7941d]" />
              )}
              <div
                draggable
                onDragStart={(e) => handleDragStart(idx, e)}
                onDragOver={(e) => handleDragOver(idx, e)}
                onDragEnd={handleDragEnd}
                onDrop={handleDrop}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#fafafa]',
                  isDragging && 'opacity-40'
                )}
              >
                <span
                  className="flex h-7 w-5 shrink-0 cursor-grab items-center justify-center text-[#bdbdbd] hover:text-[#1a1a1a] active:cursor-grabbing"
                  aria-label="Drag to reorder"
                  title={t('columns.drag_to_reorder', 'Drag to reorder')}
                >
                  <GripVertical size={14} />
                </span>
                <input
                  type="checkbox"
                  checked={col.visible}
                  onChange={() => toggle(col.id)}
                  className="h-4 w-4 shrink-0"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-[#1a1a1a]" title={col.id}>
                  {t(col.labelKey, col.id)}
                </span>
              </div>
              {showBottomIndicator && (
                <div className="pointer-events-none absolute -bottom-0.5 left-2 right-2 h-0.5 rounded-full bg-[#f7941d]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-t border-[#f0f0f0] px-5 py-3">
        <Button type="button" variant="ghost" onClick={onClose}>
          {t('columns.cancel', 'Cancel')}
        </Button>
        <Button type="button" onClick={handleApply}>
          {t('columns.apply', 'Apply')}
        </Button>
      </div>
    </div>,
    document.body
  );
}
