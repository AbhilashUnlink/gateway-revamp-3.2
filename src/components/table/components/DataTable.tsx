import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useReactTable, getCoreRowModel, type ColumnDef } from '@tanstack/react-table';
import { cn } from '@/utils/cn';
import type { ColumnConfig, TransactionRow } from '@/types/transactions/transaction.types';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { SkeletonRow } from './SkeletonRow';
import { useInfiniteScroll } from '../hooks/useInfiniteScroll';

interface DataTableProps<TRow = TransactionRow> {
  columnConfigs: ColumnConfig<TRow>[];
  data: TRow[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  className?: string;
  onRowClick?: (row: TRow) => void;
  /** Hide the trailing "no more data" footer row. Useful when the table renders
   *  a self-contained, fully loaded slice (e.g. products embedded in merchant details). */
  hideNoMoreFooter?: boolean;
}

export function DataTable<TRow = TransactionRow>({
  columnConfigs,
  data,
  loading,
  hasMore,
  onLoadMore,
  className,
  onRowClick,
  hideNoMoreFooter,
}: DataTableProps<TRow>) {
  const { t } = useTranslation();

  const tanstackColumns = useMemo<ColumnDef<TRow>[]>(
    () =>
      columnConfigs.map((col) => ({
        id: col.id,
        size: col.width,
        accessorFn: (row: TRow) => col.accessorFn(row),
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

  // Cumulative left offsets for the leading run of `sticky: true` columns.
  // Once a non-sticky column appears, the run ends — later sticky columns are
  // ignored to keep the pinned area contiguous against the left edge.
  const stickyOffsets = useMemo<(number | undefined)[]>(() => {
    let acc = 0;
    let runActive = true;
    return columnConfigs.map((col) => {
      if (!runActive || !col.sticky) {
        runActive = false;
        return undefined;
      }
      const offset = acc;
      acc += col.width;
      return offset;
    });
  }, [columnConfigs]);

  // Mark the last sticky column so it can render a right-edge shadow that
  // visually separates the fixed columns from the scrollable rest of the row.
  const stickyEdgeIndex = useMemo(() => {
    let last = -1;
    stickyOffsets.forEach((v, i) => {
      if (v !== undefined) last = i;
    });
    return last;
  }, [stickyOffsets]);

  return (
    <div
      className={cn(
        'w-full overflow-auto rounded-2xl',
       'sleek-scrollbar',
        className
      )}
    >
      <table className="border-separate border-spacing-0 w-full min-w-max">
        <TableHeader
          columnConfigs={columnConfigs}
          stickyOffsets={stickyOffsets}
          stickyEdgeIndex={stickyEdgeIndex}
          backgroundColor="bg-[var(--brand-color-soft)]"
        />
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              row={row}
              columnConfigs={columnConfigs}
              stickyOffsets={stickyOffsets}
              stickyEdgeIndex={stickyEdgeIndex}
              onRowClick={onRowClick}
            />
          ))}

          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <SkeletonRow
                key={`skeleton-${i}`}
                columnCount={columnConfigs.length}
                stickyOffsets={stickyOffsets}
                stickyEdgeIndex={stickyEdgeIndex}
              />
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

          {!loading && !hasMore && data.length > 0 && !hideNoMoreFooter && (
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
