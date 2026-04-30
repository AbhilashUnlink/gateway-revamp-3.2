import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';
import { isPresent } from '../utils/isPresent';

interface DateCellProps {
  data: CellData;
  className?: string;
}

/**
 * Splits a formatted timestamp into the leading "date + hours:minutes" portion
 * and the trailing ":seconds(.ms)?(am/pm)?" tail. Designed to be tolerant of the
 * various patterns formatDate can emit (`HH:mm:ss`, `hh:mm:ss a`, etc.).
 *
 * The seconds tail is rendered in red per Figma so the user can quickly spot
 * sub-minute precision when comparing transaction vs update timestamps.
 */
function splitSeconds(formatted: string): { head: string; tail: string } {
  const m = formatted.match(/^(.*\d{1,2}:\d{2})(:\d{2}(?:\.\d+)?\s*[A-Za-z]*)$/);
  if (!m) return { head: formatted, tail: '' };
  return { head: m[1], tail: m[2] };
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
