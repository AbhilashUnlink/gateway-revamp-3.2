import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { getStatusStyle } from '../utils/statusConfig';

interface StatusCellProps {
  data: CellData;
  className?: string;
}

export function StatusCell({ data, className }: StatusCellProps) {
  const label = data.primary ?? '';
  const statusKey = data.status ?? label;
  const style = getStatusStyle(statusKey);

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {label && (
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
      {data.secondary && (
        <span className="text-[12px] font-normal leading-[15px] text-[#808080]">
          {data.secondary}
        </span>
      )}
    </div>
  );
}
