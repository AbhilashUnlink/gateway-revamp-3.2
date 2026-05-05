import { useTranslation } from 'react-i18next';
import { DasIcon } from '@/components/ui/das-icon';
import { cn } from '@/utils/cn';

interface HistoryStatusBadgeProps {
  rawStatus: string;
  isReady: boolean;
  isProcessing: boolean;
  isFailed: boolean;
}

export function HistoryStatusBadge({
  rawStatus,
  isReady,
  isProcessing,
  isFailed,
}: HistoryStatusBadgeProps) {
  const { t } = useTranslation();
  if (isProcessing) {
    return (
      <div className="flex items-center gap-2">
        <DasIcon name="timer" size={16} className="text-[#1a1a1a]" />
        <span className="text-xs text-[#1a1a1a]">{t('download.status_preparing')}</span>
      </div>
    );
  }
  return (
    <span
      className={cn(
        'inline-flex h-5 items-center rounded-sm px-1 py-1.5 text-xs font-medium uppercase',
        isReady
          ? 'bg-[#c6f3da] text-[#1e8f1f]'
          : isFailed
            ? 'bg-[#ffe5e5] text-[#ff4343]'
            : 'bg-[#f0f0f0] text-[#808080]'
      )}
    >
      {isReady
        ? t('download.status_ready')
        : isFailed
          ? t('download.status_failed')
          : rawStatus || '—'}
    </span>
  );
}
