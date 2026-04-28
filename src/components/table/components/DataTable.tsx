import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactTable, getCoreRowModel, type ColumnDef } from '@tanstack/react-table';
import { cn } from '@/utils/cn';
import type { ColumnConfig, TransactionRow } from '@/types/transactions/transaction.types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { SkeletonRow } from './SkeletonRow';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface DataTableProps {
  columnConfigs: ColumnConfig[];
  data: TransactionRow[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
  onRowClick?: (row: TransactionRow) => void;
}

export function DataTable({
  columnConfigs,
  data,
  loading,
  hasMore,
  onLoadMore,
  className,
  onRowClick,
}: DataTableProps) {
  const { t } = useTranslation();

  const tanstackColumns = useMemo<ColumnDef<TransactionRow>[]>(
    () =>
      columnConfigs.map((col) => ({
        id: col.id,
        size: col.width,
        accessorFn: (row: TransactionRow) => col.accessorFn(row),
      })),
    [columnConfigs]
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns: tanstackColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const sentinelRef = useInfiniteScroll(onLoadMore, hasMore && !loading);

  const isEmpty = !loading && data.length === 0;

  return (
    <div className={cn('w-full overflow-auto rounded-2xl', className)}>
      <table className="border-separate border-spacing-0 w-full min-w-max">
        <TableHeader columnConfigs={columnConfigs} />
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              columnConfigs={columnConfigs}
              onRowClick={onRowClick}
            />
          ))}

          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow key={`skeleton-${i}`} columnCount={columnConfigs.length} />
            ))}

          {isEmpty && (
            <tr>
              <td
                colSpan={columnConfigs.length}
                className="py-16 text-center text-[14px] text-[#808080]"
              >
                {t('table.empty_state')}
              </td>
            </tr>
          )}

          {!loading && !hasMore && data.length > 0 && (
            <tr>
              <td
                colSpan={columnConfigs.length}
                className="py-4 text-center text-[12px] text-[#808080]"
              >
                {t('table.no_more_data')}
              </td>
            </tr>
          )}

          {hasMore && !loading && (
            <tr>
              <td colSpan={columnConfigs.length} className="p-0">
                <div ref={sentinelRef} className="h-1" />
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
