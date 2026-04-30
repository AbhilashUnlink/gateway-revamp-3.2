import { cn } from '@/utils/cn';
import type { CellData } from '@/types/transactions/transaction.types';
import { SCHEME_ICON_MAP, resolveSchemeKey } from '@/assets/icons/payment/schemeIconMap';
import { isPresent } from '../utils/isPresent';

interface PaymentCellProps {
  data: CellData;
  className?: string;
}

export function PaymentCell({ data, className }: PaymentCellProps) {
  const schemeKey = resolveSchemeKey(data.scheme);
  const SchemeIcon = schemeKey ? SCHEME_ICON_MAP[schemeKey] : null;

  const hasScheme = isPresent(data.scheme);
  const hasPrimary = isPresent(data.primary);
  const hasSecondary = isPresent(data.secondary);

  if (!hasScheme && !hasPrimary && !hasSecondary) {
    return (
      <span className={cn('text-[14px] font-normal leading-5 text-[#bdbdbd]', className)}>N/A</span>
    );
  }

  return (
    <div className={cn('flex items-start gap-2', className)}>
      {SchemeIcon ? (
        <SchemeIcon className="h-5 w-8 shrink-0" />
      ) : hasScheme ? (
        <div className="flex shrink-0 items-center justify-center h-5 px-1 rounded border border-[#e5e5e5] bg-white overflow-hidden">
          <span className="text-[10px] font-semibold uppercase text-[#1a1a1a] tracking-wide">
            {data.scheme}
          </span>
        </div>
      ) : null}
      <div className="flex flex-col gap-1 min-w-0">
        {hasSecondary && (
          <span className="text-[12px] font-normal leading-[15px] text-[#808080] uppercase">
            {data.secondary}
          </span>
        )}
        {hasPrimary && (
          <span className="text-[12px] font-normal leading-[15px] text-[#1a1a1a]">
            {data.primary}
          </span>
        )}
      </div>
    </div>
  );
}
