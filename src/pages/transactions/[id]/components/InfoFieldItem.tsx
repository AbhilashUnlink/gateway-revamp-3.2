import { Copy, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { InfoFieldConfig } from '../utils/buildSections';

interface InfoFieldItemProps {
  field: InfoFieldConfig;
  className?: string;
}

export function InfoFieldItem({ field, className }: InfoFieldItemProps) {
  const display =
    field.value !== undefined && field.value !== null && field.value !== ''
      ? String(field.value)
      : 'N/A';
  const isMissing = display === 'N/A';
  const handleCopy = () => void navigator.clipboard.writeText(display);

  return (
    <div className={cn('flex h-11 flex-col gap-1', className)}>
      <span className="text-sm leading-5 text-[#808080]">{field.label}</span>
      <div className="flex items-center gap-2">
        {field.badge ? (
          <span
            className={cn(
              'inline-flex items-center rounded px-1 py-0.5 text-xs font-medium uppercase leading-none',
              field.badge.tone === 'success'
                ? 'bg-[#c6f3da] text-[#1e8f1f]'
                : 'border border-[#e5e5e5] text-[#1a1a1a]'
            )}
          >
            {field.badge.label}
          </span>
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
        {field.copyable && !isMissing && !field.badge && (
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 text-[#808080] hover:text-[#1a1a1a]"
            aria-label="copy"
          >
            <Copy size={14} />
          </button>
        )}
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
}
