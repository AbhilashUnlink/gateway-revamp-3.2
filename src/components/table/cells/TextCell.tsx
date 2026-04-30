import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { isPresent } from '../utils/isPresent';

interface TextCellProps {
  data: CellData;
  className?: string;
}

export function TextCell({ data, className }: TextCellProps) {
  return (
    <span
      className={cn(
        'block truncate max-w-[180px] text-[14px] font-normal leading-5',
        isPresent(data.primary) ? 'text-[#1a1a1a]' : 'text-[#bdbdbd]',
        className
      )}
    >
      {isPresent(data.primary) ? data.primary : 'N/A'}
    </span>
  );
}
