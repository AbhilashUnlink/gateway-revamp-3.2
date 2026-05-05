import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasSpinner } from '@/components/ui/das-spinner';
import { Radio } from './Radio';
import type { FormatValue } from '../types';

interface FormatSelectorProps {
  format: FormatValue;
  setFormat: (next: FormatValue) => void;
  requesting: boolean;
  onSubmit: () => void;
}

export function FormatSelector({ format, setFormat, requesting, onSubmit }: FormatSelectorProps) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[#e5e5e5] bg-[#fff6e6] p-3">
      <div className="flex-1 text-sm font-semibold text-[#1a1a1a]">
        {t('download.report_format')}
      </div>
      <Radio
        label={t('download.format_csv')}
        checked={format === 'csv'}
        onChange={() => setFormat('csv')}
      />
      <Radio
        label={t('download.format_excel')}
        checked={format === 'excel'}
        onChange={() => setFormat('excel')}
      />
      <Button
        type="button"
        variant="primary"
        onClick={onSubmit}
        disabled={requesting}
        className="w-auto gap-2 shadow-[0_4px_9px_rgba(0,0,0,0.1)]"
      >
        {requesting && <DasSpinner size={14} />}
        {t('download.request_download')}
      </Button>
    </div>
  );
}
