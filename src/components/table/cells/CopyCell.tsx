import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { CopyButton } from '@/components/ui/copy-button';
import { isPresent } from '../utils/isPresent';

interface CopyCellProps {
  data: CellData;
  underline?: boolean;
  className?: string;
  onPrimaryClick?: () => void;
}

export function CopyCell({ data, underline = false, className, onPrimaryClick }: CopyCellProps) {
  const hasPrimary = isPresent(data.primary);
  const hasSecondary = isPresent(data.secondary);

  if (!hasPrimary && !hasSecondary) {
    return (
      <span className={cn('text-[14px] font-normal leading-5 text-[#bdbdbd]', className)}>N/A</span>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {hasPrimary && (
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
          <CopyButton value={data.primary} />
        </div>
      )}
      {hasSecondary && (
        <div className="flex items-center gap-3">
          <span className="text-[12px] font-normal leading-[normal] text-[#808080] truncate max-w-[120px]">
            {data.secondary}
          </span>
          <CopyButton value={data.secondary} />
        </div>
      )}
    </div>
  );
}
