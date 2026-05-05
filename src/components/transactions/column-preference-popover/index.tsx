import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnPreferenceButtonIcon } from '@/assets/icons/action-buttons';
import { PageBar } from '@/components/page-bar';
import DasPopover from '@/components/ui/das-popover';
import { DasPopoverHeader } from '@/components/ui/das-popover-header';
import { useAppDispatch } from '@/store/hooks';
import { fetchColumnPreferenceLists } from '@/store/slices/columnPreferencesSlice';
import { useColumnPreferenceState } from './useColumnPreferenceState';
import {
  ActionsBar,
  CustomListsSection,
  DeleteConfirmModal,
  DraftItemsList,
  PredefinedSection,
  SearchBar,
} from './components';
import type { ColumnDef } from './types';

export type { ColumnDef } from './types';

interface Props {
  /** Stable screen key (e.g. 'transactions'). */
  screen: string;
  /** Canonical column list for the table, in default order. */
  columns: ColumnDef[];
  ariaLabel?: string;
}

export function ColumnPreferencePopover({
  screen,
  columns,
  ariaLabel = 'Column preferences',
}: Props) {
  return (
    <DasPopover>
      <DasPopover.Trigger as={PageBar.ActionButton} aria-label={ariaLabel}>
        <ColumnPreferenceButtonIcon />
      </DasPopover.Trigger>
      <DasPopover.Content
        align="right"
        className="z-[60] mt-2 flex h-[calc(100vh-120px)] max-h-[calc(100vh-180px)] w-[760px] min-h-[280px] flex-col overflow-hidden rounded-2xl border-0 bg-white shadow-[0_4px_10px_rgba(0,0,0,0.2)]"
      >
        {({ close }) => <PopoverPanelBody onClose={close} screen={screen} columns={columns} />}
      </DasPopover.Content>
    </DasPopover>
  );
}

interface PopoverPanelBodyProps {
  onClose: () => void;
  screen: string;
  columns: ColumnDef[];
}

function PopoverPanelBody({ onClose, screen, columns }: PopoverPanelBodyProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const state = useColumnPreferenceState({ onClose, screen, columns });

  // The panel is unmounted by DasPopover on close, so this effect runs once
  // per "open" — no `open` flag needed.
  useEffect(() => {
    void dispatch(fetchColumnPreferenceLists());
  }, [dispatch]);

  return (
    <>
      <DasPopoverHeader
        icon="table"
        title={t('columns.title')}
        onClose={onClose}
        closeAriaLabel="Close"
      />
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 overflow-hidden px-4 py-4">
        {/* Left column — list selection + actions */}
        <div className="flex min-h-0 flex-col gap-6 overflow-y-auto pr-1">
          <PredefinedSection isDefault={state.isDefault} selectListKey={state.selectListKey} />
          <CustomListsSection
            lists={state.lists}
            activeKey={state.activeKey}
            selectListKey={state.selectListKey}
            setConfirmDeleteKey={state.setConfirmDeleteKey}
            newListName={state.newListName}
            setNewListName={state.setNewListName}
            isNameDuplicate={state.isNameDuplicate}
            onAddSubmit={state.handleAddList}
          />
          <ActionsBar
            isAdding={state.isAdding}
            isNameDuplicate={state.isNameDuplicate}
            saving={state.saving}
            onApply={state.handleApply}
            onAdd={state.handleAddList}
            onCancelAdd={() => state.setNewListName('')}
            onClose={onClose}
          />
        </div>

        {/* Right column — selected items */}
        <div className="flex min-h-0 flex-col gap-2">
          <h4 className="text-sm font-semibold leading-5 text-[#1a1a1a]">
            {t('columns.selected_items')}
          </h4>
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden rounded-lg border border-[#e5e5e5] bg-[#fff6e6] p-3">
            <SearchBar searchQuery={state.searchQuery} setSearchQuery={state.setSearchQuery} />
            <DraftItemsList
              filteredDraft={state.filteredDraft}
              isReadOnly={state.isReadOnly}
              dragOverIdx={state.dragOverIdx}
              getRowProps={state.getRowProps}
              onToggle={state.toggleVisibility}
            />
          </div>
        </div>
      </div>
      <DeleteConfirmModal
        open={!!state.confirmDeleteKey}
        saving={state.saving}
        onCancel={() => state.setConfirmDeleteKey(null)}
        onConfirm={state.handleConfirmDelete}
      />
    </>
  );
}
