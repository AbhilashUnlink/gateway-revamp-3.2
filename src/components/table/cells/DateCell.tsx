import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';

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
  const [primaryDate, primaryTime] = (data.primary ?? '')
    .split(' ')
    .reduce<
      [string, string]
    >((acc, part, i) => (i === 0 ? [part, acc[1]] : [acc[0], part]), ['', '']);
  const [secondaryDate, secondaryTime] = (data.secondary ?? '')
    .split(' ')
    .reduce<
      [string, string]
    >((acc, part, i) => (i === 0 ? [part, acc[1]] : [acc[0], part]), ['', '']);

  return (
    <div className={cn('flex flex-col gap-1 font-normal not-italic', className)}>
      <div className="flex items-center gap-1.5 text-[14px] leading-5 text-[#1a1a1a]">
        {primaryDate && <span>{primaryDate}</span>}
        {primaryTime && <span>{formatTimeWithRedSeconds(primaryTime)}</span>}
      </div>
      <div className="flex items-center gap-1.5 text-[14px] leading-5 text-[#808080]">
        {secondaryDate && <span>{secondaryDate}</span>}
        {secondaryTime && <span>{secondaryTime}</span>}
      </div>
    </div>
  );
}
