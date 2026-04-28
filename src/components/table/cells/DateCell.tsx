import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { formatTransactionDate } from '@/utils/formatTransactionDate';

interface DateCellProps {
  data: CellData;
  className?: string;
}

function formatTimeWithRedSeconds(time: string) {
  const match = time.match(/^(.+)(:[\d]{2})$/);
  if (!match) return <span>{time}</span>;
  return (
    <>
      <span>{match[1]}</span>
      <span className="text-[#ff4343]">{match[2]}</span>
    </>
  );
}

export function DateCell({ data, className }: DateCellProps) {
  const primary = formatTransactionDate(data.primary);
  const secondary = formatTransactionDate(data.secondary);

  return (
    <div className={cn('flex flex-col gap-1 font-normal not-italic', className)}>
      <div className="flex items-center gap-1.5 text-[14px] leading-5 text-[#1a1a1a]">
        {primary.date && <span>{primary.date}</span>}
        {primary.time && <span>{formatTimeWithRedSeconds(primary.time)}</span>}
      </div>
      <div className="flex items-center gap-1.5 text-[14px] leading-5 text-[#808080]">
        {secondary.date && <span>{secondary.date}</span>}
        {secondary.time && <span>{formatTimeWithRedSeconds(secondary.time)}</span>}
      </div>
    </div>
  );
}
