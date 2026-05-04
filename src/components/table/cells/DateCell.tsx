import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';
import { splitSeconds } from '@/utils/formatDate';
import { isPresent } from '../utils/isPresent';

interface DateCellProps {
  data: CellData;
  className?: string;
}

function DatePart({ value, mutedHead }: { value: string; mutedHead: boolean }) {
  const { head, tail } = splitSeconds(value);
  return (
    <span
      className={cn('text-[14px] leading-5', mutedHead ? 'text-[#808080]' : 'text-[#1a1a1a]')}
      title={value}
    >
      {head}
      {tail && <span className="text-[#ff4343]">{tail}</span>}
    </span>
  );
}

export function DateCell({ data, className }: DateCellProps) {
  const format = useUserDateFormat();
  const primary = isPresent(data.primary) ? format(String(data.primary)) : '';
  const secondary = isPresent(data.secondary) ? format(String(data.secondary)) : '';

  if (!primary && !secondary) {
    return (
      <span className={cn('text-[14px] font-normal leading-5 text-[#bdbdbd]', className)}>N/A</span>
    );
  }

  return (
    <div className={cn('flex flex-col gap-1 font-normal not-italic', className)}>
      {primary && <DatePart value={primary} mutedHead={false} />}
      {secondary && <DatePart value={secondary} mutedHead />}
    </div>
  );
}
