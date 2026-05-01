import { memo } from 'react';
import { Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CopyButton } from '@/components/ui/CopyButton';
import type { InfoFieldConfig } from '../types';
import { StatusBadge } from './primitives';

interface InfoFieldItemProps {
  field: InfoFieldConfig;
  className?: string;
}

export const InfoFieldItem = memo(function InfoFieldItem({ field, className }: InfoFieldItemProps) {
  const display =
    field.value !== undefined && field.value !== null && field.value !== ''
      ? String(field.value)
      : 'N/A';
  const isMissing = display === 'N/A';

  return (
    <div className={cn('flex h-11 flex-col gap-1', className)}>
      <span className="text-sm leading-5 text-[#808080]">{field.label}</span>
      <div className="flex items-center gap-2">
        {field.badge ? (
          <StatusBadge label={field.badge.label} tone={field.badge.tone} />
        ) : (
          <span
            className={cn(
              'truncate text-sm leading-5',
              isMissing ? 'text-[#808080]' : 'text-[#1a1a1a]'
            )}
          >
            {display}
          </span>
        )}
        {field.copyable && !isMissing && !field.badge && <CopyButton value={display} />}
        {field.downloadable && !isMissing && (
          <button
            type="button"
            className="shrink-0 text-[#808080] hover:text-[#1a1a1a]"
            aria-label="download"
          >
            <Download size={14} />
          </button>
        )}
      </div>
    </div>
  );
});
