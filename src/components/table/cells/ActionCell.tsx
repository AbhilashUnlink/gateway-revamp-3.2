import { useState } from 'react';
import { Copy, Check, Download } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';

interface ActionCellProps {
  data: CellData;
  onDownload?: (value: string) => void;
  className?: string;
}

export function ActionCell({ data, onDownload, className }: ActionCellProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!data.primary) return;
    navigator.clipboard.writeText(data.primary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-[14px] font-normal leading-5 text-[#1a1a1a] truncate max-w-[120px]">
        {data.primary ?? 'N/A'}
      </span>
      {data.primary && (
        <>
          <button
            onClick={handleCopy}
            aria-label="Copy"
            className="shrink-0 text-neutral-400 hover:text-[#f7941d] transition-colors focus-visible:outline-none"
          >
            {copied ? <Check size={14} className="text-[#1e8f1f]" /> : <Copy size={14} />}
          </button>
          {data.downloadable && (
            <button
              onClick={() => onDownload?.(data.primary!)}
              aria-label="Download"
              className="shrink-0 text-neutral-400 hover:text-[#f7941d] transition-colors focus-visible:outline-none"
            >
              <Download size={14} />
            </button>
          )}
        </>
      )}
    </div>
  );
}
