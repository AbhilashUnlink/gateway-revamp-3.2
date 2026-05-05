import { useTranslation } from 'react-i18next';
import { AppliedFiltersTrigger } from './AppliedFiltersTrigger';
import type { AppliedFilterEntry } from '../types';

interface TotalRecordsRowProps {
  totalRecords: number | string;
  appliedFilterEntries: AppliedFilterEntry[];
  hasAppliedFilters: boolean;
}

export function TotalRecordsRow({
  totalRecords,
  appliedFilterEntries,
  hasAppliedFilters,
}: TotalRecordsRowProps) {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-[#4d4d4d]">
        <span className="font-normal">{t('download.total_records')} </span>
        <span className="font-semibold text-[#1a1a1a]">{totalRecords}</span>
      </div>
      <AppliedFiltersTrigger
        entries={appliedFilterEntries}
        disabled={!hasAppliedFilters}
        label={t('download.view_applied_filters')}
        title={t('download.applied_filters_title')}
        closeLabel={t('download.close')}
      />
    </div>
  );
}
