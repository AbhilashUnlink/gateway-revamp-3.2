import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Check, ChevronDown, ChevronUp, Loader2, Plus, Trash2, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setColumnPreference, resetColumnPreference } from '@/store/slices/columnPreferencesSlice';
import {
  createColumnPreferenceList,
  deleteColumnPreferenceList,
  fetchColumnPreferenceLists,
  selectColumnPreferenceLists,
  selectColumnPreferenceListsLoading,
  selectColumnPreferenceListsSaving,
  updateColumnPreferenceList,
  type ColumnPreferenceList,
} from '@/store/slices/columnPreferenceListsSlice';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/cn';

const DEFAULT_UUID = '__default__';

export interface ColumnDef {
  id: string;
  /** Backend display name (round-trips to/from `columns_json`). */
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

/** Build the draft list from a saved profile's `columns_json` (display names). */
function buildDraftFromProfile(columns: ColumnDef[], saved: string[] | null): DraftItem[] {
  const byDisplay = new Map(columns.map((c) => [c.displayName, c]));
  const seen = new Set<string>();
  const out: DraftItem[] = [];

  if (saved && saved.length) {
    for (const name of saved) {
      const col = byDisplay.get(name);
      if (!col || seen.has(col.id)) continue;
      out.push({ ...col, visible: true });
      seen.add(col.id);
    }
    // Append any remaining columns (default-hidden).
    for (const col of columns) {
      if (seen.has(col.id)) continue;
      out.push({ ...col, visible: false });
    }
    return out;
  }

  // No saved profile → everything visible in default order.
  return columns.map((c) => ({ ...c, visible: true }));
}

export function ColumnPreferenceDrawer({ open, onClose, anchorRef, screen, columns }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const lists = useAppSelector(selectColumnPreferenceLists);
  const loading = useAppSelector(selectColumnPreferenceListsLoading);
  const saving = useAppSelector(selectColumnPreferenceListsSaving);

  const popRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; maxHeight: number } | null>(
    null
  );
  const [selectedUuid, setSelectedUuid] = useState<string>(DEFAULT_UUID);
  const [draft, setDraft] = useState<DraftItem[]>([]);
  const [newListName, setNewListName] = useState('');
  const [confirmDeleteUuid, setConfirmDeleteUuid] = useState<string | null>(null);

  // Position the popover under the anchor, right-aligned. Height tracks the
  // remaining viewport below the anchor (≈ table area).
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

  // Fetch the saved profiles list when the drawer opens (cached after first call).
  useEffect(() => {
    if (!open) return;
    void dispatch(fetchColumnPreferenceLists());
  }, [open, dispatch]);

  // Re-seed selection from the backend `isSelected` flag whenever lists update.
  useEffect(() => {
    if (!open) return;
    const active = lists.find((p) => p.isSelected);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedUuid(active?.uuid ?? DEFAULT_UUID);
  }, [open, lists]);

  // Re-seed the right-pane draft whenever the active profile changes.
  useEffect(() => {
    if (!open) return;
    if (selectedUuid === DEFAULT_UUID) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDraft(buildDraftFromProfile(columns, null));
      return;
    }
    const profile = lists.find((p) => p.uuid === selectedUuid);
     
    setDraft(buildDraftFromProfile(columns, profile?.columns_json ?? null));
  }, [open, selectedUuid, lists, columns]);

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

  const finalProfiles = useMemo<ColumnPreferenceList[]>(
    () => [{ uuid: DEFAULT_UUID, name: 'default', columns_json: [] }, ...lists],
    [lists]
  );

  const isNameDuplicate =
    !!newListName.trim() &&
    lists.some((p) => p.name.trim().toLowerCase() === newListName.trim().toLowerCase());

  const toggle = (id: string) =>
    setDraft((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));
  const move = (idx: number, dir: -1 | 1) => {
    setDraft((prev) => {
      const target = idx + dir;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };
  const showAll = () => setDraft((prev) => prev.map((c) => ({ ...c, visible: true })));
  const hideAll = () => setDraft((prev) => prev.map((c) => ({ ...c, visible: false })));

  /** Sync the local visibility/order slice so the table updates immediately. */
  const commitToTable = (items: DraftItem[]) => {
    const order = items.map((c) => c.id);
    const hidden = items.filter((c) => !c.visible).map((c) => c.id);
    dispatch(setColumnPreference({ screen, preference: { order, hidden } }));
  };

  const visibleDisplayNames = useMemo(
    () => draft.filter((c) => c.visible).map((c) => c.displayName),
    [draft]
  );

  const handleApply = async () => {
    if (selectedUuid === DEFAULT_UUID) {
      // Default: just clear local override; nothing to persist on the backend.
      dispatch(resetColumnPreference(screen));
      onClose();
      return;
    }
    const profile = lists.find((p) => p.uuid === selectedUuid);
    if (!profile) return;
    const action = await dispatch(
      updateColumnPreferenceList({
        uuid: profile.uuid,
        name: profile.name,
        columns_json: visibleDisplayNames,
        currentSelectedList: true,
      })
    );
    if (updateColumnPreferenceList.fulfilled.match(action)) {
      commitToTable(draft);
      onClose();
    }
  };

  const handleAddList = async () => {
    const name = newListName.trim();
    if (!name || isNameDuplicate) return;
    const action = await dispatch(
      createColumnPreferenceList({
        name,
        columns_json: visibleDisplayNames.length
          ? visibleDisplayNames
          : columns.map((c) => c.displayName),
        currentSelectedList: true,
      })
    );
    if (createColumnPreferenceList.fulfilled.match(action) && action.payload) {
      setSelectedUuid(action.payload.uuid);
      commitToTable(draft.length ? draft : columns.map((c) => ({ ...c, visible: true })));
      setNewListName('');
    }
  };

  const handleConfirmDelete = async () => {
    if (!confirmDeleteUuid) return;
    await dispatch(deleteColumnPreferenceList(confirmDeleteUuid));
    if (selectedUuid === confirmDeleteUuid) setSelectedUuid(DEFAULT_UUID);
    setConfirmDeleteUuid(null);
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
          <h3 className="text-lg font-semibold text-[#1a1a1a]">
            {t('columns.title', 'Transaction Preference')}
          </h3>
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
              <h4 className="text-sm font-semibold text-[#1a1a1a]">
                {t('columns.custom_lists', 'Custom Transaction Preference List')}
              </h4>

              {loading && lists.length === 0 ? (
                <div className="flex items-center gap-2 text-sm text-[#808080]">
                  <Loader2 size={14} className="animate-spin" />
                  {t('columns.loading', 'Loading…')}
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  {finalProfiles.map((p) => {
                    const isSelected = selectedUuid === p.uuid;
                    const isDefault = p.uuid === DEFAULT_UUID;
                    return (
                      <div
                        key={p.uuid}
                        className={cn(
                          'group flex items-center gap-2 rounded-lg border px-3 py-2',
                          isSelected ? 'border-[#1a1a1a] bg-[#fafafa]' : 'border-[#e5e5e5] bg-white'
                        )}
                      >
                        <input
                          type="radio"
                          name="column-preference"
                          checked={isSelected}
                          onChange={() => setSelectedUuid(p.uuid)}
                          className="h-4 w-4 shrink-0"
                        />
                        <span
                          className="min-w-0 flex-1 truncate text-sm text-[#1a1a1a]"
                          title={p.name}
                        >
                          {isDefault ? t('columns.default', 'Default') : p.name}
                        </span>
                        {!isDefault && (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteUuid(p.uuid)}
                            disabled={isSelected}
                            aria-label="Delete"
                            title={
                              isSelected
                                ? t('columns.cannot_delete_active', 'Cannot delete the active list')
                                : t('columns.delete', 'Delete')
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
              )}

              <div className="pt-2">
                <Button type="button" onClick={handleApply} disabled={saving} className="w-full">
                  {saving ? (
                    <Loader2 size={14} className="mr-1.5 animate-spin" />
                  ) : (
                    <Check size={14} className="mr-1.5" />
                  )}
                  {t('columns.apply', 'Apply')}
                </Button>
              </div>
            </div>

            {/* Add new list */}
            <div className="mt-auto border-t border-[#f0f0f0] bg-[#fafafa] px-6 py-4">
              <h4 className="mb-2 text-sm font-semibold text-[#1a1a1a]">
                {t('columns.add_list', 'Add Transaction Preference List')}
              </h4>
              <div className="flex flex-col gap-1.5">
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAddList();
                  }}
                  placeholder={t('columns.enter_name', 'Enter list name')}
                  className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
                />
                {isNameDuplicate && (
                  <span className="text-xs text-[#ff4343]">
                    {t('columns.name_taken', 'A list with this name already exists')}
                  </span>
                )}
                <Button
                  type="button"
                  onClick={handleAddList}
                  disabled={!newListName.trim() || isNameDuplicate || saving}
                >
                  <Plus size={14} className="mr-1.5" />
                  {t('columns.add', 'Add')}
                </Button>
              </div>
            </div>
          </div>

          {/* Right: column list */}
          <div className="flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#f0f0f0] px-6 py-3">
              <span className="text-sm font-semibold text-[#1a1a1a]">
                {t('columns.columns', 'Columns')}
              </span>
              <div className="flex items-center gap-3 text-xs">
                <button
                  type="button"
                  onClick={showAll}
                  className="font-medium text-[#1a1a1a] hover:text-[#f7941d]"
                >
                  {t('columns.show_all', 'Show all')}
                </button>
                <span className="text-[#bdbdbd]">·</span>
                <button
                  type="button"
                  onClick={hideAll}
                  className="font-medium text-[#1a1a1a] hover:text-[#f7941d]"
                >
                  {t('columns.hide_all', 'Hide all')}
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2">
              {draft.map((col, idx) => (
                <div
                  key={col.id}
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-[#fafafa]"
                >
                  <input
                    type="checkbox"
                    checked={col.visible}
                    onChange={() => toggle(col.id)}
                    className="h-4 w-4 shrink-0"
                  />
                  <span
                    className="min-w-0 flex-1 truncate text-sm text-[#1a1a1a]"
                    title={col.displayName}
                  >
                    {t(col.labelKey, col.displayName)}
                  </span>
                  <div className="flex shrink-0 items-center gap-0.5">
                    <button
                      type="button"
                      onClick={() => move(idx, -1)}
                      disabled={idx === 0}
                      aria-label="Move up"
                      className="flex h-7 w-7 items-center justify-center rounded text-[#808080] hover:bg-white hover:text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(idx, 1)}
                      disabled={idx === draft.length - 1}
                      aria-label="Move down"
                      className="flex h-7 w-7 items-center justify-center rounded text-[#808080] hover:bg-white hover:text-[#1a1a1a] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      {confirmDeleteUuid && (
        <div
          data-column-pref-modal="true"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40"
        >
          <div className="w-[400px] rounded-2xl bg-white p-6 shadow-xl">
            <h4 className="text-lg font-semibold text-[#1a1a1a]">
              {t('columns.delete_title', 'Delete Transaction Preference List')}
            </h4>
            <p className="mt-2 text-sm text-[#808080]">
              {t(
                'columns.delete_confirm',
                'Do you really want to delete this record? This process cannot be undone.'
              )}
            </p>
            <div className="mt-5 flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setConfirmDeleteUuid(null)}>
                {t('columns.cancel', 'Cancel')}
              </Button>
              <Button
                type="button"
                onClick={handleConfirmDelete}
                className="bg-[#ff4343] hover:bg-[#e23838]"
              >
                {t('columns.delete', 'Delete')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
