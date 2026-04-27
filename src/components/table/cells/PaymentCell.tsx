import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';

interface PaymentCellProps {
  data: CellData;
  className?: string;
}

export function PaymentCell({ data, className }: PaymentCellProps) {
  return (
    <div className={cn('flex items-start gap-2', className)}>
      {data.scheme && (
        <div className="flex items-center justify-center shrink-0 h-5 px-1 rounded border border-[#e5e5e5] bg-white overflow-hidden">
          <span className="text-[10px] font-semibold uppercase text-[#1a1a1a] tracking-wide">
            {data.scheme}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-1 min-w-0">
        {data.secondary && (
          <span className="text-[12px] font-normal leading-[15px] text-[#808080] uppercase">
            {data.secondary}
          </span>
        )}
        {data.primary && (
          <span className="text-[12px] font-normal leading-[15px] text-[#1a1a1a]">
            {data.primary}
          </span>
        )}
      </div>
    </div>
  );
}
