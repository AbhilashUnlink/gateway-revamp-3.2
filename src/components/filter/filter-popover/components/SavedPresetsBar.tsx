import { type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { PresetList } from './PresetList';
import { SavePresetForm } from './SavePresetForm';

interface PresetItem {
  uuid: string;
  name: string;
}

interface SavedPresetsBarProps {
  presets: PresetItem[];
  saving: boolean;
  canSave: boolean;
  savingMode: boolean;
  presetName: string;
  setPresetName: (v: string) => void;
  saveInputRef: RefObject<HTMLInputElement | null>;
  onEnterSaveMode: () => void;
  onExitSaveMode: () => void;
  onSubmitSave: () => void;
  onLoad: (uuid: string) => void;
  onDelete: (uuid: string) => void;
}

export function SavedPresetsBar({
  presets,
  saving,
  canSave,
  savingMode,
  presetName,
  setPresetName,
  saveInputRef,
  onEnterSaveMode,
  onExitSaveMode,
  onSubmitSave,
  onLoad,
  onDelete,
}: SavedPresetsBarProps) {
  const { t } = useTranslation();
  return (
    <div className="border-t border-[#f0f0f0] bg-[#fafafa] px-5 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-[#808080]">
          {t('filter.saved_filters', 'Saved filters')}
        </span>
        {savingMode ? (
          <SavePresetForm
            inputRef={saveInputRef}
            presetName={presetName}
            setPresetName={setPresetName}
            saving={saving}
            onSubmit={onSubmitSave}
            onCancel={onExitSaveMode}
          />
        ) : (
          <SaveButton canSave={canSave} onClick={onEnterSaveMode} />
        )}
      </div>
      <PresetList presets={presets} onLoad={onLoad} onDelete={onDelete} />
    </div>
  );
}

function SaveButton({ canSave, onClick }: { canSave: boolean; onClick: () => void }) {
  const { t } = useTranslation();
  return (
    <Button
      type="button"
      variant="chip"
      size="xs"
      onClick={onClick}
      disabled={!canSave}
      title={
        !canSave
          ? t('filter.save_requires_filters', 'Add a complete filter before saving as preset')
          : t('filter.save_as_preset', 'Save current as preset')
      }
      className="gap-1.5 hover:bg-white disabled:hover:border-[#e5e5e5]"
    >
      <DasIcon name="bookmark" size={12} />
      {t('filter.save', 'Save')}
    </Button>
  );
}
