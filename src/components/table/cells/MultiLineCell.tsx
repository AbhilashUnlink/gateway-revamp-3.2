import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { isPresent } from '../utils/isPresent';

interface MultiLineCellProps {
  data: CellData;
  className?: string;
}

export function MultiLineCell({ data, className }: MultiLineCellProps) {
  const hasAny = isPresent(data.primary) || isPresent(data.secondary) || isPresent(data.tertiary);

  if (!hasAny) {
    return (
      <span className={cn('text-[14px] font-normal leading-5 text-[#bdbdbd]', className)}>N/A</span>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      {isPresent(data.primary) && (
        <span className="text-[14px] font-semibold leading-5 text-[#1a1a1a]">{data.primary}</span>
      )}
      {isPresent(data.secondary) && (
        <span className="text-[12px] font-normal leading-[15px] text-[#808080]">
          {data.secondary}
        </span>
      )}
      {isPresent(data.tertiary) && (
        <span className="text-[12px] font-normal leading-[15px] text-[#808080]">
          {data.tertiary}
        </span>
      )}
    </div>
  );
}
