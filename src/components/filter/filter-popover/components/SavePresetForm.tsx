import { type RefObject } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasSpinner } from '@/components/ui/das-spinner';

interface SavePresetFormProps {
  inputRef: RefObject<HTMLInputElement | null>;
  presetName: string;
  setPresetName: (v: string) => void;
  saving: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export function SavePresetForm({
  inputRef,
  presetName,
  setPresetName,
  saving,
  onSubmit,
  onCancel,
}: SavePresetFormProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-1 items-center gap-2">
      <input
        ref={inputRef}
        type="text"
        value={presetName}
        onChange={(e) => setPresetName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onSubmit();
          if (e.key === 'Escape') onCancel();
        }}
        placeholder={t('filter.preset_name', 'Filter name…')}
        className="h-8 min-w-0 flex-1 rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
      />
      <Button
        type="button"
        variant="subtle"
        size="xs"
        onClick={onCancel}
        disabled={saving}
        className="hover:bg-white"
      >
        {t('filter.cancel', 'Cancel')}
      </Button>
      <Button
        type="button"
        variant="dark"
        size="xs"
        onClick={onSubmit}
        disabled={!presetName.trim() || saving}
        className="gap-1.5"
      >
        {saving && <DasSpinner size={12} />}
        {t('filter.save', 'Save')}
      </Button>
    </div>
  );
}
