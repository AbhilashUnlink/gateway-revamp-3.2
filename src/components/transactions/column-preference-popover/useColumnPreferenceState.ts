import { useEffect, useMemo, useState } from 'react';
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
  getColumnsConfigFromColumnsJson,
  TRANSACTION_DEFAULT_KEY,
} from '@/utils/transactionColumnsConfig';
import { useListReorder } from '@/hooks/useListReorder';
import { buildDraft, isMandatoryId } from './buildDraft';
import { useDraftSearch } from './useDraftSearch';
import type { ColumnDef, DraftItem } from './types';

interface UseColumnPreferenceStateInput {
  onClose: () => void;
  screen: string;
  columns: ColumnDef[];
}

/**
 * Owns all popover state: which list is active, the working draft, the
 * "new list name" form, the delete-confirm modal, search filtering, and the
 * commit/save side-effects. Returns a flat object the popover root
 * destructures and prop-drills to subcomponents.
 *
 * The hook assumes it is mounted only while the popover is open — the
 * panel itself is unmounted by `DasPopover` on close — so it doesn't gate
 * its effects on an external `open` flag.
 */
export function useColumnPreferenceState({
  onClose,
  screen,
  columns,
}: UseColumnPreferenceStateInput) {
  const dispatch = useAppDispatch();
  const lists = useAppSelector(selectColumnPreferenceLists);
  const activeBackendList = useAppSelector(selectActiveColumnPreferenceList);
  const saving = useAppSelector(selectColumnPreferenceListsSaving);

  const [activeKey, setActiveKey] = useState<string>(
    activeBackendList?.uuid ?? TRANSACTION_DEFAULT_KEY
  );
  const [draft, setDraft] = useState<DraftItem[]>([]);
  const [newListName, setNewListName] = useState('');
  const [confirmDeleteKey, setConfirmDeleteKey] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isDefault = activeKey === TRANSACTION_DEFAULT_KEY;
  const isReadOnly = isDefault;
  const isAdding = !!newListName.trim();

  const { dragOverIdx, getRowProps } = useListReorder<DraftItem>({
    items: draft,
    setItems: setDraft,
    disabled: isReadOnly,
    isItemLocked: (item) => isMandatoryId(item.id),
  });

  const fallbackIds = useMemo(() => columns.map((c) => c.id), [columns]);
  const activeList = useMemo(
    () => lists.find((p) => p.uuid === activeKey) ?? null,
    [lists, activeKey]
  );
  const isNameDuplicate =
    !!newListName.trim() &&
    lists.some((p) => p.name.trim().toLowerCase() === newListName.trim().toLowerCase());

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

  // Re-sync the active key whenever the backend-confirmed selection changes.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActiveKey(activeBackendList?.uuid ?? TRANSACTION_DEFAULT_KEY);
  }, [activeBackendList]);

  // Re-sync the draft when the underlying list set changes; user clicks on
  // rows sync the draft synchronously via `selectListKey` so this effect
  // doesn't re-run on those.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDraft(buildDraftForKey(activeKey));
    setSearchQuery('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lists]);

  const filteredDraft = useDraftSearch(draft, searchQuery);

  const commitToTable = (items: DraftItem[]) => {
    const order = items.map((c) => c.id);
    const hidden = items.filter((c) => !c.visible).map((c) => c.id);
    dispatch(setColumnPreference({ screen, preference: { order, hidden } }));
  };

  const toggleVisibility = (id: string) => {
    if (isReadOnly || isMandatoryId(id)) return;
    setDraft((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));
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

  return {
    // selection / state
    activeKey,
    isDefault,
    isReadOnly,
    isAdding,
    isNameDuplicate,
    saving,
    // lists + draft
    lists,
    draft,
    filteredDraft,
    searchQuery,
    newListName,
    confirmDeleteKey,
    // dnd
    dragOverIdx,
    getRowProps,
    // actions
    selectListKey,
    toggleVisibility,
    setSearchQuery,
    setNewListName,
    setConfirmDeleteKey,
    handleApply,
    handleAddList,
    handleConfirmDelete,
  };
}

export type ColumnPreferenceState = ReturnType<typeof useColumnPreferenceState>;
