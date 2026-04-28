import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';

interface CopyCellProps {
  data: CellData;
  underline?: boolean;
  className?: string;
  onPrimaryClick?: () => void;
}

export function CopyCell({ data, underline = false, className, onPrimaryClick }: CopyCellProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {data.primary && (
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'text-[14px] font-semibold leading-5 text-[#1a1a1a] truncate max-w-[136px]',
              underline && 'underline decoration-solid',
              onPrimaryClick && 'cursor-pointer hover:text-[#f7941d]'
            )}
            onClick={
              onPrimaryClick
                ? (e) => {
                    e.stopPropagation();
                    onPrimaryClick();
                  }
                : undefined
            }
          >
            {data.primary}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(data.primary!);
            }}
            aria-label="Copy"
            className="shrink-0 text-neutral-400 hover:text-[#f7941d] transition-colors focus-visible:outline-none"
          >
            {copied ? <Check size={14} className="text-[#1e8f1f]" /> : <Copy size={14} />}
          </button>
        </div>
      )}
      {data.secondary && (
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-normal leading-[normal] text-[#808080] truncate max-w-[120px]">
            {data.secondary}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopy(data.secondary!);
            }}
            aria-label="Copy"
            className="shrink-0 text-neutral-400 hover:text-[#f7941d] transition-colors focus-visible:outline-none"
          >
            <Copy size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
