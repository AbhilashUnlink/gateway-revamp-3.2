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
import { DasSpinner } from '@/components/ui/DasSpinner';
import { DasIcon } from '@/components/ui/DasIcon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createColumnPreferenceList,
  deleteColumnPreferenceList,
  resetColumnPreference,
  selectActiveColumnPreferenceList,
  selectColumnPreferenceLists,
  selectColumnPreferenceListsSaving,
  setColumnPreference,
  setSelectedListUuid,
  updateColumnPreferenceList,
} from '@/store/slices/columnPreferencesSlice';
import {
  buildColumnsJsonFromDraft,
  filterHiddenColumns,
  getColumnsConfigFromColumnsJson,
  HIDDEN_COLUMN_IDS,
  MANDATORY_COLUMN_IDS,
  MANDATORY_COLUMN_IDS_ORDERED,
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
  const visibleColumns = filterHiddenColumns(columns);
  const byId = new Map(visibleColumns.map((c) => [c.id, c]));
  const hiddenSet = new Set(hiddenIds);
  const seen = new Set<string>();
  const tail: DraftItem[] = [];

  for (const id of orderedIds) {
    if (seen.has(id) || HIDDEN_COLUMN_IDS.has(id) || MANDATORY_COLUMN_IDS.has(id)) continue;
    const col = byId.get(id);
    if (!col) continue;
    tail.push({ ...col, visible: !hiddenSet.has(id) });
    seen.add(id);
  }
  for (const col of visibleColumns) {
    if (seen.has(col.id) || MANDATORY_COLUMN_IDS.has(col.id)) continue;
    tail.push({ ...col, visible: !hiddenSet.has(col.id) });
  }

  const mandatoryHead: DraftItem[] = [];
  for (const id of MANDATORY_COLUMN_IDS_ORDERED) {
    const col = byId.get(id);
    if (!col) continue;
    mandatoryHead.push({ ...col, visible: true });
  }
  return [...mandatoryHead, ...tail];
}

// ──────────────── Toggle (matches Figma 28×16 brand pill) ────────────────
interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

function Toggle({ checked, onChange, disabled, ariaLabel }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      className={cn(
        'relative h-4 w-7 shrink-0 rounded-full transition-colors',
        checked ? 'bg-[#f7941d]' : 'border border-[#e5e5e5] bg-white',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <span
        className={cn(
          'absolute h-3 w-3 rounded-full shadow-[0_2px_4px_rgba(39,39,39,0.1)] transition-all',
          // The off-state has a 1px border (box-sizing: border-box), which
          // shrinks the content box; offset the knob by 1px less to keep it
          // visually centered.
          checked ? 'left-[14px] top-[2px] bg-white' : 'left-[1px] top-[1px] bg-[#f7941d]'
        )}
      />
    </button>
  );
}

export function ColumnPreferencePopover({ open, onClose, anchorRef, screen, columns }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const lists = useAppSelector(selectColumnPreferenceLists);
  const activeBackendList = useAppSelector(selectActiveColumnPreferenceList);
  const saving = useAppSelector(selectColumnPreferenceListsSaving);

  const popRef = useRef<HTMLDivElement>(null);
  const dragFromRef = useRef<number | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; maxHeight: number } | null>(
    null
  );
  const [activeKey, setActiveKey] = useState<string>(
    activeBackendList?.uuid ?? TRANSACTION_DEFAULT_KEY
  );
  const [draft, setDraft] = useState<DraftItem[]>([]);
  const [newListName, setNewListName] = useState('');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isDefault = activeKey === TRANSACTION_DEFAULT_KEY;
  const isReadOnly = isDefault;
  const fallbackIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const activeList = useMemo(
    () => lists.find((p) => p.uuid === activeKey) ?? null,
    [lists, activeKey]
  );

  const isNameDuplicate =
    !!newListName.trim() &&
    lists.some((p) => p.name.trim().toLowerCase() === newListName.trim().toLowerCase());

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

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveKey(activeBackendList?.uuid ?? TRANSACTION_DEFAULT_KEY);
  }, [open, activeBackendList]);

  const buildDraftForKey = (key: string): DraftItem[] => {
    const isDefaultKey = key === TRANSACTION_DEFAULT_KEY;
    const matchingList = lists.find((p) => p.uuid === key) ?? null;
    const columnsJson = isDefaultKey ? null : (matchingList?.columns_json ?? null);
    const { orderedColumns, hiddenColumns } = getColumnsConfigFromColumnsJson(
      columnsJson,
      fallbackIds
    );
    return buildDraft(columns, orderedColumns, hiddenColumns);
  };

  useEffect(() => {
    if (!open) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(buildDraftForKey(activeKey));
     
    setSearchQuery('');
    // Only re-sync when the popover opens or the underlying list set changes;
    // user clicks on rows sync the draft synchronously via selectListKey.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lists]);

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

  const commitToTable = (items: DraftItem[]) => {
    const order = items.map((c) => c.id);
    const hidden = items.filter((c) => !c.visible).map((c) => c.id);
    dispatch(setColumnPreference({ screen, preference: { order, hidden } }));
  };

  const isMandatoryId = (id: string) => MANDATORY_COLUMN_IDS.has(id);

  const toggle = (id: string) => {
    if (isReadOnly || isMandatoryId(id)) return;
    setDraft((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));
  };

  const firstSortableIdx = (items: DraftItem[]) => {
    let i = 0;
    while (i < items.length && isMandatoryId(items[i]!.id)) i++;
    return i;
  };

  const handleDragStart = (idx: number) => (e: DragEvent<HTMLDivElement>) => {
    if (isReadOnly) return;
    if (isMandatoryId(draft[idx]?.id ?? '')) {
      e.preventDefault();
      return;
    }
    dragFromRef.current = idx;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(idx));
  };
  const handleDragOver = (idx: number) => (e: DragEvent<HTMLDivElement>) => {
    if (isReadOnly || dragFromRef.current === null) return;
    if (isMandatoryId(draft[idx]?.id ?? '')) return;
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
      const lockedTop = firstSortableIdx(prev);
      if (from < lockedTop || idx < lockedTop) return prev;
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

  const handleApply = async () => {
    if (isDefault) {
      dispatch(setSelectedListUuid(null));
      dispatch(resetColumnPreference(screen));
      onClose();
      return;
    }
    if (!activeList) return;
    const action = await dispatch(
      updateColumnPreferenceList({
        uuid: activeList.uuid,
        name: activeList.name,
        columns_json: buildColumnsJsonFromDraft(draft),
        currentSelectedList: true,
      })
    );
    if (!updateColumnPreferenceList.fulfilled.match(action)) return;
    commitToTable(draft);
    onClose();
  };

  const handleAddList = async () => {
    const name = newListName.trim();
    if (!name || isNameDuplicate) return;
    const seedDraft = draft.length ? draft : columns.map((c) => ({ ...c, visible: true }));

    const action = await dispatch(
      createColumnPreferenceList({
        name,
        columns_json: buildColumnsJsonFromDraft(seedDraft),
        currentSelectedList: true,
      })
    );
    if (!createColumnPreferenceList.fulfilled.match(action) || !action.payload) return;

    setActiveKey(action.payload.uuid);
    commitToTable(seedDraft);
    setNewListName('');
  };

  /**
   * All list-row selections (Default + custom) go through here so typing a
   * new-list name and clicking an existing row are mutually exclusive — the
   * footer button switches between Apply and Save based on `newListName`.
   */
  const selectListKey = (key: string) => {
    setActiveKey(key);
    setNewListName('');
    setSearchQuery('');
    setDraft(buildDraftForKey(key));
  };

  const isAdding = !!newListName.trim();

  const handleConfirmDelete = async () => {
    if (!confirmDeleteKey || confirmDeleteKey === TRANSACTION_DEFAULT_KEY) {
      setConfirmDeleteKey(null);
      return;
    }
    const wasActive = activeKey === confirmDeleteKey;
    const action = await dispatch(deleteColumnPreferenceList(confirmDeleteKey));
    if (!deleteColumnPreferenceList.fulfilled.match(action)) return;
    if (wasActive) {
      setActiveKey(TRANSACTION_DEFAULT_KEY);
      dispatch(resetColumnPreference(screen));
    }
    setConfirmDeleteKey(null);
  };

  // Filter the right-pane list by search query while preserving original
  // draft indices so drag-and-drop stays correct.
  const indexedDraft = useMemo(() => draft.map((item, idx) => ({ item, idx })), [draft]);
  const filteredDraft = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return indexedDraft;
    return indexedDraft.filter(
      ({ item }) =>
        t(item.labelKey, item.displayName).toLowerCase().includes(q) ||
        item.displayName.toLowerCase().includes(q)
    );
  }, [indexedDraft, searchQuery, t]);

  if (!open || !position) return null;

  const customLists = lists;

  return createPortal(
    <>
      {/* Popover */}
      <div
        ref={popRef}
        role="dialog"
        aria-modal="false"
        className="fixed z-[60] flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
        style={{
          top: position.top,
          left: position.left,
          width: POPOVER_WIDTH,
          // Fixed height (not max-height) so the popover stays a constant
          // size when the search filter shrinks the right-pane list.
          height: position.maxHeight,
        }}
      >
        {/* Header — soft orange tint */}
        <div className="flex h-[66px] shrink-0 items-center gap-2 rounded-t-2xl bg-[#fff6e6] px-4 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white">
            <DasIcon name="table" size={16} className="text-[#1a1a1a]" />
          </div>
          <h3 className="flex-1 text-base font-semibold leading-5 text-[#1a1a1a]">
            {t('columns.title')}
          </h3>
          <Button type="button" variant="icon" size="icon" onClick={onClose} aria-label="Close">
            <DasIcon name="circle-x" size={24} strokeWidth={1.5} />
          </Button>
        </div>

        {/* Body — two columns */}
        <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-hidden px-4 py-4">
          {/* Left column — Predefined + Custom + actions */}
          <div className="flex min-h-0 flex-col gap-6 overflow-y-auto pr-1">
            {/* Predefined List */}
            <section className="flex flex-col gap-2">
              <h4 className="text-sm font-semibold leading-5 text-[#1a1a1a]">
                {t('columns.predefined_lists')}
              </h4>
              <PredefinedRow
                label={t('columns.default')}
                selected={isDefault}
                onSelect={() => selectListKey(TRANSACTION_DEFAULT_KEY)}
              />
            </section>

            {/* Custom Preferred List */}
            <section className="flex flex-col gap-3">
              <h4 className="text-sm font-semibold leading-5 text-[#1a1a1a]">
                {t('columns.custom_lists')}
              </h4>

              <div className="flex flex-col gap-3">
                {customLists.map((p) => {
                  const isSelected = activeKey === p.uuid;
                  return (
                    <CustomListRow
                      key={p.uuid}
                      label={p.name}
                      selected={isSelected}
                      onSelect={() => selectListKey(p.uuid)}
                      onDelete={() => setConfirmDeleteKey(p.uuid)}
                      deleteDisabled={isSelected}
                      deleteTitle={
                        isSelected ? t('columns.cannot_delete_active') : t('columns.delete')
                      }
                    />
                  );
                })}

                {/* Add New */}
                <div className="flex flex-col gap-2 border-t border-[#e5e5e5] pt-3">
                  <span className="inline-flex w-fit items-center gap-2 text-sm font-semibold leading-5 text-[#1a1a1a]">
                    {t('columns.add_new')}
                    <DasIcon name="plus" size={16} />
                  </span>
                  <input
                    type="text"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddList();
                    }}
                    placeholder={t('columns.enter_name')}
                    className="h-12 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#f7941d]"
                  />
                  {isNameDuplicate && (
                    <span className="text-xs text-[#ff4343]">{t('columns.name_taken')}</span>
                  )}
                </div>
              </div>
            </section>

            {/* Actions — Apply switches to Save while a new-list name is being typed. */}
            <div className="mt-auto flex gap-3 pt-2 pb-1">
              <Button
                type="button"
                variant="primary"
                onClick={isAdding ? handleAddList : handleApply}
                disabled={saving || (isAdding && isNameDuplicate)}
                className="flex-1"
              >
                {isAdding ? t('columns.save') : t('columns.apply')}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  if (isAdding) {
                    setNewListName('');
                    return;
                  }
                  onClose();
                }}
                disabled={saving}
                className="flex-1"
              >
                {t('columns.cancel')}
              </Button>
            </div>
          </div>

          {/* Right column — Selected items */}
          <div className="flex min-h-0 flex-col gap-2">
            <h4 className="text-sm font-semibold leading-5 text-[#1a1a1a]">
              {t('columns.selected_items')}
            </h4>

            <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-lg border border-[#e5e5e5] bg-[#fff6e6] p-3">
              {/* Search */}
              <div className="flex h-9 shrink-0 items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white pl-3 pr-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('columns.search')}
                  className="h-full flex-1 bg-transparent text-xs leading-[15px] text-[#1a1a1a] outline-none placeholder:text-[#808080]"
                />
                <DasIcon name="search" size={16} className="text-[#808080]" />
              </div>

              {/* List */}
              <div className="-mr-1 flex-1 overflow-y-auto pr-1">
                {filteredDraft.map(({ item: col, idx }) => {
                  const isDragOver = dragOverIdx === idx;
                  const isMandatoryRow = isMandatoryId(col.id);
                  const rowLocked = isReadOnly || isMandatoryRow;
                  return (
                    <div
                      key={col.id}
                      draggable={!rowLocked}
                      onDragStart={handleDragStart(idx)}
                      onDragOver={handleDragOver(idx)}
                      onDrop={handleDrop(idx)}
                      onDragEnd={handleDragEnd}
                      onDragLeave={() => {
                        if (dragOverIdx === idx) setDragOverIdx(null);
                      }}
                      className={cn(
                        'flex items-center gap-2.5 py-3',
                        isDragOver && !rowLocked && 'rounded ring-1 ring-[#f7941d]'
                      )}
                    >
                      <Button
                        type="button"
                        variant="icon"
                        size="icon"
                        aria-label={t('columns.drag_to_reorder')}
                        title={t('columns.drag_to_reorder')}
                        disabled={rowLocked}
                        className={cn(
                          'size-4 shrink-0 text-[#808080]',
                          rowLocked
                            ? 'cursor-not-allowed opacity-30'
                            : 'cursor-grab hover:text-[#1a1a1a]'
                        )}
                      >
                        <DasIcon name="move" size={14} />
                      </Button>
                      <span
                        className="min-w-0 flex-1 truncate text-sm leading-5 text-[#1a1a1a]"
                        title={col.displayName}
                      >
                        {t(col.labelKey, col.displayName)}
                      </span>
                      <Toggle
                        checked={col.visible}
                        disabled={rowLocked}
                        onChange={() => toggle(col.id)}
                        ariaLabel={col.displayName}
                      />
                    </div>
                  );
                })}
                {filteredDraft.length === 0 && (
                  <div className="py-8 text-center text-xs text-[#808080]">—</div>
                )}
              </div>
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
              <Button
                type="button"
                variant="ghost"
                onClick={() => setConfirmDeleteKey(null)}
                disabled={saving}
              >
                {t('columns.cancel')}
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleConfirmDelete}
                disabled={saving}
              >
                {saving && <DasSpinner size={14} className="mr-1.5" />}
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

// ──────────────── Sub-rows ────────────────

interface RowChromeProps {
  selected: boolean;
}

const rowChrome = ({ selected }: RowChromeProps) =>
  cn(
    'flex h-12 w-full items-center gap-3 rounded-lg border p-3 transition-colors',
    selected ? 'border-[#f7941d] bg-[#fff6e6]' : 'border-[#e5e5e5] bg-white'
  );

function PredefinedRow({
  label,
  selected,
  onSelect,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(rowChrome({ selected }), 'cursor-pointer text-left')}
    >
      <span className="min-w-0 flex-1 truncate text-sm leading-5 text-[#1a1a1a]" title={label}>
        {label}
      </span>
      <Toggle checked={selected} onChange={() => onSelect()} ariaLabel={label} />
    </button>
  );
}

function CustomListRow({
  label,
  selected,
  onSelect,
  onDelete,
  deleteDisabled,
  deleteTitle,
}: {
  label: string;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  deleteDisabled: boolean;
  deleteTitle: string;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(rowChrome({ selected }), 'group cursor-pointer')}
    >
      <span className="min-w-0 flex-1 truncate text-sm leading-5 text-[#1a1a1a]" title={label}>
        {label}
      </span>
      <Button
        type="button"
        variant="icon"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        disabled={deleteDisabled}
        aria-label="Delete"
        title={deleteTitle}
        className="text-[#f7941d] hover:text-[#ff4343] hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <DasIcon name="trash-2" size={20} />
      </Button>
      <Toggle checked={selected} onChange={() => onSelect()} ariaLabel={label} />
    </div>
  );
}
