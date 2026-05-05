import { cn } from '@/utils/cn';
import { DasIcon } from '@/components/ui/DasIcon';
import { Button } from '@/components/ui/button';
import type { CellData } from '@/types/transactions/transaction.types';
import { CopyButton } from '@/components/ui/CopyButton';
import { isPresent } from '../utils/isPresent';

interface ActionCellProps {
  data: CellData;
  onDownload?: (value: string) => void;
  className?: string;
}

export function ActionCell({ data, onDownload, className }: ActionCellProps) {
  const hasPrimary = isPresent(data.primary);

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span
        className={cn(
          'text-[14px] font-normal leading-5 truncate max-w-[120px]',
          hasPrimary ? 'text-[#1a1a1a]' : 'text-[#bdbdbd]'
        )}
      >
        {hasPrimary ? data.primary : 'N/A'}
      </span>
      {hasPrimary && (
        <>
          <CopyButton value={data.primary} />
          {data.downloadable && (
            <Button
              type="button"
              variant="icon"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                onDownload?.(String(data.primary));
              }}
              aria-label="Download"
              className="shrink-0 text-neutral-400 hover:text-[#f7941d] hover:opacity-100"
            >
              <DasIcon name="download" size={14} />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
