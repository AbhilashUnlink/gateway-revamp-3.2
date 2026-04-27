import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';

interface MultiLineCellProps {
  data: CellData;
  className?: string;
}

export function MultiLineCell({ data, className }: MultiLineCellProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {data.primary && (
        <span className="text-[14px] font-semibold leading-5 text-[#1a1a1a]">{data.primary}</span>
      )}
      {data.secondary && (
        <span className="text-[12px] font-normal leading-[15px] text-[#808080]">
          {data.secondary}
        </span>
      )}
      {data.tertiary && (
        <span className="text-[12px] font-normal leading-[15px] text-[#808080]">
          {data.tertiary}
        </span>
      )}
    </div>
  );
}
