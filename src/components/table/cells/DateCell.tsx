import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';

interface DateCellProps {
  data: CellData;
  className?: string;
}

export function DateCell({ data, className }: DateCellProps) {
  const format = useUserDateFormat();
  const primary = data.primary ? format(data.primary) : '';
  const secondary = data.secondary ? format(data.secondary) : '';

  return (
    <div className={cn('flex flex-col gap-1 font-normal not-italic', className)}>
      {primary && (
        <div className="text-[14px] leading-5 text-[#1a1a1a]" title={primary}>
          {primary}
        </div>
      )}
      {secondary && (
        <div className="text-[14px] leading-5 text-[#808080]" title={secondary}>
          {secondary}
        </div>
      )}
    </div>
  );
}
