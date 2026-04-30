import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { getStatusStyle } from '../utils/statusConfig';
import { isPresent } from '../utils/isPresent';

interface StatusCellProps {
  data: CellData;
  className?: string;
}

export function StatusCell({ data, className }: StatusCellProps) {
  const hasLabel = isPresent(data.primary);
  const hasSecondary = isPresent(data.secondary);

  if (!hasLabel && !hasSecondary) {
    return (
      <span className={cn('text-[14px] font-normal leading-5 text-[#bdbdbd]', className)}>N/A</span>
    );
  }

  const label = String(data.primary ?? '');
  const statusKey = data.status ?? label;
  const style = getStatusStyle(statusKey);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {hasLabel && (
        <span
          className={cn(
            'inline-flex items-center px-1 py-0.5 rounded text-[12px] font-medium uppercase whitespace-nowrap max-w-max',
            style.bg,
            style.text
          )}
        >
          {label}
        </span>
      )}
      {hasSecondary && (
        <span className="text-[12px] font-normal leading-[15px] text-[#808080]">
          {data.secondary}
        </span>
      )}
    </div>
  );
}
