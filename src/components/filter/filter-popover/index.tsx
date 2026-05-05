import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { PageBar } from '@/components/page-bar';
import DasPopover from '@/components/ui/das-popover';
import { DasPopoverHeader } from '@/components/ui/das-popover-header';
import { useAppSelector } from '@/store/hooks';
import { makeSelectAppliedCount, type FilterScreen } from '@/store/slices/filterSlice';
import type { FilterField } from '../types';
import { useFilterDraft } from './useFilterDraft';
import { usePresetFilters } from './usePresetFilters';
import { ActionsBar, DraftRulesList, SavedPresetsBar } from './components';

interface Props {
  screen: FilterScreen;
  fields: FilterField[];
}

export function FilterPopover({ screen, fields }: Props) {
  const { t } = useTranslation();
  const appliedCount = useAppSelector(useMemo(() => makeSelectAppliedCount(screen), [screen]));

  return (
    <DasPopover>
      <DasPopover.Trigger
        as={PageBar.FilterButton}
        label={t('transactions_page.filters')}
        count={appliedCount}
      />
      <DasPopover.Content
        align="right"
        className="z-[60] mt-2 flex max-h-[calc(100vh-120px)] w-[520px] flex-col overflow-hidden rounded-2xl border-0 bg-white drop-shadow-[0px_4px_10px_rgba(0,0,0,0.2)]"
      >
        {({ close }) => <PopoverPanelBody onClose={close} screen={screen} fields={fields} />}
      </DasPopover.Content>
    </DasPopover>
  );
}

interface PopoverPanelBodyProps {
  onClose: () => void;
  screen: FilterScreen;
  fields: FilterField[];
}

function PopoverPanelBody({ onClose, screen, fields }: PopoverPanelBodyProps) {
  const { t } = useTranslation();
  const draft = useFilterDraft({ screen, fields });
  const presetState = usePresetFilters({
    screen,
    fields,
    draftRules: draft.draftRules,
    allRulesComplete: draft.allRulesComplete,
  });

  const handleApply = () => {
    draft.handleApply();
    if (draft.canApply) onClose();
  };

  const handleCancel = () => {
    draft.handleReset();
    presetState.exitSaveMode();
    onClose();
  };

  const handleClose = () => {
    presetState.exitSaveMode();
    onClose();
  };

  return (
    <>
      <DasPopoverHeader
        icon="filter"
        title={t('filter.title', 'Advanced Filters')}
        onClose={handleClose}
        closeAriaLabel={t('filter.close', 'Close')}
      />

      <DraftRulesList
        draftRules={draft.draftRules}
        fields={fields}
        takenFieldIds={draft.takenFieldIds}
        canAdd={draft.canAdd}
        allRulesComplete={draft.allRulesComplete}
        hasFreeField={draft.hasFreeField}
        onAdd={draft.handleAdd}
        onUpdate={draft.handleUpdate}
        onRemove={draft.handleRemove}
      />

      <ActionsBar canApply={draft.canApply} onApply={handleApply} onCancel={handleCancel} />

      <SavedPresetsBar
        presets={presetState.presets}
        saving={presetState.saving}
        canSave={presetState.canSave}
        savingMode={presetState.savingMode}
        presetName={presetState.presetName}
        setPresetName={presetState.setPresetName}
        saveInputRef={presetState.saveInputRef}
        onEnterSaveMode={presetState.enterSaveMode}
        onExitSaveMode={presetState.exitSaveMode}
        onSubmitSave={presetState.submitSave}
        onLoad={presetState.loadPreset}
        onDelete={presetState.deletePreset}
      />
    </>
  );
}
