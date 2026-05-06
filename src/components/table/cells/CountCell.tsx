import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';

interface CountCellProps {
  data: CellData;
  className?: string;
}

export function CountCell({ data, className }: CountCellProps) {
  const value = data.primary;
  const numeric = typeof value === 'number' ? value : Number(value ?? 0);
  const display = Number.isFinite(numeric) ? numeric : 0;

  return (
    <span
      className={cn(
        'inline-flex h-6 min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] font-semibold leading-none text-white bg-[#f7941d]',
        className
      )}
    >
      {display}
    </span>
  );
}
