import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type DragEvent,
  type RefObject,
} from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Check, GripVertical, Plus, Trash2, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setColumnPreference, resetColumnPreference } from '@/store/slices/columnPreferencesSlice';
import {
  removeTransactionListEntry,
  selectTransactionListMap,
  selectTransactionListSelectedKey,
  setTransactionListEntry,
  setTransactionListSelected,
} from '@/store/slices/gatewayConfigSlice';
import {
  buildTransactionListEntry,
  getTransactionColumnsConfig,
  TRANSACTION_DEFAULT_KEY,
} from '@/utils/transactionColumnsConfig';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

export interface ColumnDef {
  id: string;
  /** Backend display name (round-trips to/from `columns_json`/`updatedList`). */
  displayName: string;
  /** UI label (i18n key) for the right-pane checklist. */
  labelKey: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  /** Anchor element — popover positions itself just below + right-aligned. */
  anchorRef: RefObject<HTMLElement | null>;
  /** Stable screen key (e.g. 'transactions'). */
  screen: string;
  /** Canonical column list for the table, in default order. */
  columns: ColumnDef[];
}

const POPOVER_WIDTH = 760;
const POPOVER_GAP = 8;
const VIEWPORT_BOTTOM_MARGIN = 24;

interface DraftItem {
  id: string;
  displayName: string;
  labelKey: string;
  visible: boolean;
}

function buildDraft(columns: ColumnDef[], orderedIds: string[], hiddenIds: string[]): DraftItem[] {
  const byId = new Map(columns.map((c) => [c.id, c]));
  const hiddenSet = new Set(hiddenIds);
  const seen = new Set<string>();
  const out: DraftItem[] = [];

  for (const id of orderedIds) {
    if (seen.has(id)) continue;
    const col = byId.get(id);
    if (!col) continue;
    out.push({ ...col, visible: !hiddenSet.has(id) });
    seen.add(id);
  }
  // Append any remaining columns at the end so newly-added schema columns
  // never disappear from the picker.
  for (const col of columns) {
    if (seen.has(col.id)) continue;
    out.push({ ...col, visible: !hiddenSet.has(col.id) });
  }
  return out;
}

export function ColumnPreferencePopover({ open, onClose, anchorRef, screen, columns }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const listMap = useAppSelector(selectTransactionListMap);
  const selectedKey = useAppSelector(selectTransactionListSelectedKey);

  const popRef = useRef<HTMLDivElement>(null);
  const dragFromRef = useRef<number | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; maxHeight: number } | null>(
    null
  );
  const [activeKey, setActiveKey] = useState<string>(selectedKey);
  const [draft, setDraft] = useState<DraftItem[]>([]);
  const [newListName, setNewListName] = useState('');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const isDefault = activeKey === TRANSACTION_DEFAULT_KEY;
  const isReadOnly = isDefault;
  const fallbackIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const profileKeys = useMemo(() => {
    const keys = Object.keys(listMap);
    // Always surface the default option even if backend hasn't sent it yet.
    return keys.includes(TRANSACTION_DEFAULT_KEY) ? keys : [TRANSACTION_DEFAULT_KEY, ...keys];
  }, [listMap]);

  const isNameDuplicate =
    !!newListName.trim() &&
    Object.keys(listMap).some((k) => k.trim().toLowerCase() === newListName.trim().toLowerCase());

  // Position the popover under the anchor, right-aligned.
  useLayoutEffect(() => {
    if (!open) return;
    const update = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      const top = rect.bottom + POPOVER_GAP;
      const left = Math.max(8, rect.right - POPOVER_WIDTH);
      const maxHeight = Math.max(280, window.innerHeight - top - VIEWPORT_BOTTOM_MARGIN);
      setPosition({ top, left, maxHeight });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, anchorRef]);

  // Re-seed the active key from Redux whenever the popover opens or the
  // backend-confirmed selection changes.
  useEffect(() => {
    if (!open) return;
    setActiveKey(selectedKey);
  }, [open, selectedKey]);

  // Rebuild the draft whenever the active profile changes.
  useEffect(() => {
    if (!open) return;
    const { orderedColumns, hiddenColumns } = getTransactionColumnsConfig(
      { transactionList: { list: listMap, selected: activeKey } },
      activeKey,
      fallbackIds
    );
    setDraft(buildDraft(columns, orderedColumns, hiddenColumns));
  }, [open, activeKey, listMap, columns, fallbackIds]);

  // Close on outside click + ESC. Don't close when interacting with the
  // confirmation modal (rendered as a separate portal at higher z-index).
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      if (target instanceof Element && target.closest('[data-column-pref-modal="true"]')) return;
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

  /** Sync the local visibility/order slice so the table updates immediately. */
  const commitToTable = (items: DraftItem[]) => {
    const order = items.map((c) => c.id);
    const hidden = items.filter((c) => !c.visible).map((c) => c.id);
    dispatch(setColumnPreference({ screen, preference: { order, hidden } }));
  };

  const toggle = (id: string) => {
    if (isReadOnly) return;
    setDraft((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));
  };
  const showAll = () => {
    if (isReadOnly) return;
    setDraft((prev) => prev.map((c) => ({ ...c, visible: true })));
  };
  const hideAll = () => {
    if (isReadOnly) return;
    setDraft((prev) => prev.map((c) => ({ ...c, visible: false })));
  };

  const handleDragStart = (idx: number) => (e: DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    dragFromRef.current = idx;
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox to actually start a drag.
    e.dataTransfer.setData('text/plain', String(idx));
  };
  const handleDragOver = (idx: number) => (e: DragEvent<HTMLDivElement>) => {
    if (isReadOnly || dragFromRef.current === null) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIdx !== idx) setDragOverIdx(idx);
  };
  const handleDrop = (idx: number) => (e: DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    e.preventDefault();
    const from = dragFromRef.current;
    dragFromRef.current = null;
    setDragOverIdx(null);
    if (from === null || from === idx) return;
    setDraft((prev) => {
      const next = [...prev];
      const [moved] = next.splice(from, 1);
      if (!moved) return prev;
      next.splice(idx, 0, moved);
      return next;
    });
  };
  const handleDragEnd = () => {
    dragFromRef.current = null;
    setDragOverIdx(null);
  };

  const handleApply = () => {
    if (isDefault) {
      // Default profile is read-only → just clear local override and persist
      // the selection on userPreference.
      dispatch(setTransactionListSelected(TRANSACTION_DEFAULT_KEY));
      dispatch(resetColumnPreference(screen));
      onClose();
      return;
    }
    const existing = listMap[activeKey] ?? {};
    const { ['order']: _o, ['unChecked']: _u, ['updatedList']: _l, ...extras } = existing;
    void _o;
    void _u;
    void _l;
    dispatch(
      setTransactionListEntry({
        key: activeKey,
        entry: buildTransactionListEntry(draft, extras),
      })
    );
    dispatch(setTransactionListSelected(activeKey));
    commitToTable(draft);
    onClose();
  };

  const handleAddList = () => {
    const name = newListName.trim();
    if (!name || isNameDuplicate) return;
    const seedDraft = draft.length ? draft : columns.map((c) => ({ ...c, visible: true }));
    dispatch(
      setTransactionListEntry({
        key: name,
        entry: buildTransactionListEntry(seedDraft),
      })
    );
    dispatch(setTransactionListSelected(name));
    setActiveKey(name);
    commitToTable(seedDraft);
    setNewListName('');
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteKey) return;
    dispatch(removeTransactionListEntry(confirmDeleteKey));
    if (selectedKey === confirmDeleteKey) {
      dispatch(setTransactionListSelected(TRANSACTION_DEFAULT_KEY));
      setActiveKey(TRANSACTION_DEFAULT_KEY);
      dispatch(resetColumnPreference(screen));
    }
    setConfirmDeleteKey(null);
  };

  if (!open || !position) return null;

  return createPortal(
    <>
      {/* Popover */}
      <div
        ref={popRef}
        role="dialog"
        aria-modal="false"
        className="fixed z-[60] flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_12px_40px_rgba(0,0,0,0.18)]"
        style={{
          top: position.top,
          left: position.left,
          width: POPOVER_WIDTH,
          maxHeight: position.maxHeight,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-4">
          <h3 className="text-lg font-semibold text-[#1a1a1a]">{t('columns.title')}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-[#fafafa]"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — two columns */}
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-0 overflow-hidden">
          {/* Left: profiles */}
          <div className="flex flex-col overflow-hidden border-r border-[#f0f0f0]">
            <div className="flex flex-col gap-3 overflow-y-auto px-6 py-5">
              <h4 className="text-sm font-semibold text-[#1a1a1a]">{t('columns.custom_lists')}</h4>

              <div className="flex flex-col gap-1.5">
                {profileKeys.map((key) => {
                  const isSelected = activeKey === key;
                  const isDefaultRow = key === TRANSACTION_DEFAULT_KEY;
                  return (
                    <div
                      key={key}
                      className={cn(
                        'group flex items-center gap-2 rounded-lg border px-3 py-2',
                        isSelected ? 'border-[#1a1a1a] bg-[#fafafa]' : 'border-[#e5e5e5] bg-white'
                      )}
                    >
                      <input
                        type="radio"
                        name="column-preference"
                        checked={isSelected}
                        onChange={() => setActiveKey(key)}
                        className="h-4 w-4 shrink-0"
                      />
                      <span
                        className="min-w-0 flex-1 truncate text-sm text-[#1a1a1a]"
                        title={isDefaultRow ? t('columns.default') : key}
                      >
                        {isDefaultRow ? t('columns.default') : key}
                      </span>
                      {!isDefaultRow && (
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteKey(key)}
                          disabled={isSelected}
                          aria-label="Delete"
                          title={
                            isSelected ? t('columns.cannot_delete_active') : t('columns.delete')
                          }
                          className="shrink-0 text-[#808080] opacity-0 transition-opacity hover:text-[#ff4343] disabled:cursor-not-allowed disabled:opacity-30 group-hover:opacity-100"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <Button type="button" onClick={handleApply} className="w-full">
                  <Check size={14} className="mr-1.5" />
                  {t('columns.apply')}
                </Button>
              </div>
            </div>

            {/* Add new list */}
            <div className="mt-auto border-t border-[#f0f0f0] bg-[#fafafa] px-6 py-4">
              <h4 className="mb-2 text-sm font-semibold text-[#1a1a1a]">{t('columns.add_list')}</h4>
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddList();
                  }}
                  placeholder={t('columns.enter_name')}
                  className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
                />
                {isNameDuplicate && (
                  <span className="text-xs text-[#ff4343]">{t('columns.name_taken')}</span>
                )}
                <Button
                  type="button"
                  onClick={handleAddList}
                  disabled={!newListName.trim() || isNameDuplicate}
                >
                  <Plus size={14} className="mr-1.5" />
                  {t('columns.add')}
                </Button>
              </div>
            </div>
          </div>

          {/* Right: column list */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-3">
              <span className="text-sm font-semibold text-[#1a1a1a]">{t('columns.columns')}</span>
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={showAll}
                  disabled={isReadOnly}
                  className="font-medium text-[#1a1a1a] hover:text-[#f7941d] disabled:cursor-not-allowed disabled:text-[#bdbdbd] disabled:hover:text-[#bdbdbd]"
                >
                  {t('columns.show_all')}
                </button>
                <span className="text-[#bdbdbd]">·</span>
                <button
                  type="button"
                  onClick={hideAll}
                  disabled={isReadOnly}
                  className="font-medium text-[#1a1a1a] hover:text-[#f7941d] disabled:cursor-not-allowed disabled:text-[#bdbdbd] disabled:hover:text-[#bdbdbd]"
                >
                  {t('columns.hide_all')}
                </button>
              </div>
            </div>
            {isReadOnly && (
              <div className="border-b border-[#f0f0f0] bg-[#fffbe6] px-6 py-2 text-xs text-[#8a6d3b]">
                {t('columns.default_readonly')}
              </div>
            )}
            <div className="flex-1 overflow-y-auto px-3 py-2">
              {draft.map((col, idx) => {
                const isDragOver = dragOverIdx === idx;
                return (
                  <div
                    key={col.id}
                    draggable={!isReadOnly}
                    onDragStart={handleDragStart(idx)}
                    onDragOver={handleDragOver(idx)}
                    onDrop={handleDrop(idx)}
                    onDragEnd={handleDragEnd}
                    onDragLeave={() => {
                      if (dragOverIdx === idx) setDragOverIdx(null);
                    }}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#fafafa]',
                      isDragOver && !isReadOnly && 'bg-[#f0f7ff] ring-1 ring-[#1a1a1a]'
                    )}
                  >
                    <button
                      type="button"
                      aria-label={t('columns.drag_to_reorder')}
                      title={t('columns.drag_to_reorder')}
                      disabled={isReadOnly}
                      className={cn(
                        'flex h-7 w-5 shrink-0 items-center justify-center text-[#bdbdbd]',
                        isReadOnly
                          ? 'cursor-not-allowed opacity-30'
                          : 'cursor-grab hover:text-[#1a1a1a]'
                      )}
                    >
                      <GripVertical size={14} />
                    </button>
                    <input
                      type="checkbox"
                      checked={col.visible}
                      onChange={() => toggle(col.id)}
                      disabled={isReadOnly}
                      className="h-4 w-4 shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span
                      className="min-w-0 flex-1 truncate text-sm text-[#1a1a1a]"
                      title={col.displayName}
                    >
                      {t(col.labelKey, col.displayName)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDeleteKey && (
        <div
          data-column-pref-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40"
        >
          <div className="w-[400px] rounded-2xl bg-white p-6 shadow-xl">
            <h4 className="text-lg font-semibold text-[#1a1a1a]">{t('columns.delete_title')}</h4>
            <p className="mt-2 text-sm text-[#808080]">{t('columns.delete_confirm')}</p>
            <div className="mt-5 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setConfirmDeleteKey(null)}>
                {t('columns.cancel')}
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-[#ff4343] hover:bg-[#e23838]"
              >
                {t('columns.delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
