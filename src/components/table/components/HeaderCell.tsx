import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { ColumnConfig } from '@/types/transactions/transaction.types';

interface HeaderCellProps {
  config: ColumnConfig;
  className?: string;
}

export function HeaderCell({ config, className }: HeaderCellProps) {
  const { t } = useTranslation();

  return (
    <th
      style={{ width: config.width, minWidth: config.width }}
      className={cn('px-6 pt-[11px] pb-1 text-left align-top whitespace-nowrap', className)}
    >
      <div className="flex flex-col gap-0.5">
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
