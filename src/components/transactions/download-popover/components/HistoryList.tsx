import { useTranslation } from 'react-i18next';
import { DasIcon } from '@/components/ui/das-icon';
import { DasSpinner } from '@/components/ui/das-spinner';
import type { DownloadEntry } from '@/store/slices/downloadsSlice';
import type { FilterField } from '@/components/filter/types';
import { HistoryRow } from './HistoryRow';

interface HistoryListProps {
  list: DownloadEntry[];
  loading: boolean;
  fields: FilterField[];
  downloadingByJobId: Record<string, boolean>;
  onDownload: (jobID: string) => void;
}

export function HistoryList({
  list,
  loading,
  fields,
  downloadingByJobId,
  onDownload,
}: HistoryListProps) {
  const { t } = useTranslation();
  const safeList = Array.isArray(list) ? list : [];

  if (loading && safeList.length === 0) {
    return (
      <div className="flex items-center justify-center gap-2 py-10 text-sm text-[#808080]">
        <DasSpinner size={14} />
        {t('download.loading')}
      </div>
    );
  }

  if (safeList.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg bg-[#fafafa] px-4 py-10 text-center">
        <DasIcon name="file-text" size={28} className="text-[#bdbdbd]" />
        <span className="text-sm text-[#808080]">{t('download.empty')}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {safeList.map((item, idx) => (
        <HistoryRow
          key={item.JobID ?? item.ID ?? idx}
          item={item}
          fields={fields}
          downloading={!!(item.JobID && downloadingByJobId[item.JobID])}
          onDownload={() => item.JobID && onDownload(item.JobID)}
        />
      ))}
    </div>
  );
}
