import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { DasSpinner } from '@/components/ui/das-spinner';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';
import { cn } from '@/utils/cn';
import type { DownloadEntry } from '@/store/slices/downloadsSlice';
import type { FilterField } from '@/components/filter/types';
import { itemFiltersToEntries } from '../filterEntries';
import { AppliedFiltersTrigger } from './AppliedFiltersTrigger';
import { HistoryStatusBadge } from './HistoryStatusBadge';

interface HistoryRowProps {
  item: DownloadEntry;
  fields: FilterField[];
  downloading: boolean;
  onDownload: () => void;
}

export function HistoryRow({ item, fields, downloading, onDownload }: HistoryRowProps) {
  const { t } = useTranslation() as { t: (key: string, defaultValue?: string) => string };
  const formatUserDate = useUserDateFormat();
  const status = String(item.ReportStatus ?? '').toUpperCase();
  const isReady = status === 'COMPLETED' || status === 'SUCCESS' || status === 'READY';
  const isProcessing = status === 'PROCESSING' || status === 'PENDING' || status === 'IN_PROGRESS';
  const isFailed = status === 'FAILED' || status === 'ERROR';
  const fileName = item.FileName
    ? String(item.FileName)
    : item.CreatedAt
      ? `Transaction Details ${formatUserDate(item.CreatedAt)}`
      : (item.JobID ?? '—');
  const itemEntries = useMemo(() => itemFiltersToEntries(item, fields, t), [item, fields, t]);
  const hasItemFilters = itemEntries.length > 0;

  // Progress: ready → 100%, processing → 41% placeholder (no real % from API).
  const progressPct = isReady ? 100 : isProcessing ? 41 : 0;

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-[#e5e5e5] bg-[#fafafa] px-3 pt-0 pb-3">
      {/* Progress bar — sits flush at the top, no horizontal padding inside row's px-3 */}
      <div className="-mx-3 grid grid-cols-1">
        <div className="col-start-1 row-start-1 h-1 rounded-sm bg-[#e5e5e5]" />
        <div
          className={cn(
            'col-start-1 row-start-1 h-1 rounded-sm',
            isFailed ? 'bg-[#ff4343]' : 'bg-[#f7941d]'
          )}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <HistoryStatusBadge
          rawStatus={status}
          isReady={isReady}
          isProcessing={isProcessing}
          isFailed={isFailed}
        />
        <AppliedFiltersTrigger
          entries={itemEntries}
          disabled={!hasItemFilters}
          label={t('download.view_applied_filters')}
          title={t('download.applied_filters_title')}
          closeLabel={t('download.close')}
        />
      </div>

      <div className="flex items-center gap-2">
        <DasIcon name="file-text" size={20} className="shrink-0 text-[#1e8f1f]" />
        <div className="min-w-0 flex-1 truncate text-sm text-[#1a1a1a]" title={fileName}>
          {fileName}
        </div>
        <Button
          type="button"
          variant="primary"
          size="icon"
          onClick={onDownload}
          disabled={!isReady || downloading || !item.JobID}
          aria-label={t('download.download_action')}
          title={item.ReportURL ? String(item.ReportURL) : undefined}
          className={cn(
            'h-6 w-6 shrink-0 rounded-sm shadow-[0_4px_9px_rgba(0,0,0,0.04)] disabled:cursor-not-allowed',
            !isReady && 'opacity-30'
          )}
        >
          {downloading ? <DasSpinner size={14} /> : <DasIcon name="download" size={14} />}
        </Button>
      </div>
    </div>
  );
}
