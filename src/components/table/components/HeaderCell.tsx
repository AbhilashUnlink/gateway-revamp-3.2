import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { ColumnConfig } from '@/types/transactions/transaction.types';

interface HeaderCellProps<TRow = unknown> {
  config: ColumnConfig<TRow>;
  className?: string;
  /** When set, this header cell is pinned `left: <offset>px` while the table scrolls. */
  stickyLeft?: number;
  /** Last sticky column — renders a right-edge shadow to separate from scroll area. */
  isStickyEdge?: boolean;
}

export function HeaderCell<TRow = unknown>({
  config,
  className,
  stickyLeft,
  isStickyEdge,
}: HeaderCellProps<TRow>) {
  const { t } = useTranslation();
  const isSticky = stickyLeft !== undefined;

  return (
    <th
      style={{
        width: config.width,
        minWidth: config.width,
        ...(isSticky ? { left: stickyLeft } : null),
      }}
      className={cn(
        'px-6 pt-[11px] pb-1 text-left align-middle whitespace-nowrap',
        isSticky && 'sticky z-30 bg-inherit',
        isStickyEdge && 'shadow-[8px_0_8px_-6px_rgba(0,0,0,0.12)]',
        className
      )}
    >
      <div className="flex min-h-12 flex-col justify-center gap-0.5">
        <span className="text-[16px] font-semibold leading-5 text-[#1a1a1a]">
          {t(config.headerPrimaryKey)}
        </span>
        {config.headerSecondaryKey && (
          <span className="text-[14px] font-normal leading-5 text-[#1a1a1a]">
            {t(config.headerSecondaryKey)}
          </span>
        )}
      </div>
    </th>
  );
}
