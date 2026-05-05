import { useTranslation } from 'react-i18next';
import { TRANSACTION_DEFAULT_KEY } from '@/utils/transactionColumnsConfig';
import { PredefinedRow } from './PredefinedRow';

interface PredefinedSectionProps {
  isDefault: boolean;
  selectListKey: (key: string) => void;
}

export function PredefinedSection({ isDefault, selectListKey }: PredefinedSectionProps) {
  const { t } = useTranslation();
  return (
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
  );
}
