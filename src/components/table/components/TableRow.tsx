import type { Row } from '@tanstack/react-table';
import { cn } from '@/utils/cn';
import type {
  CellData,
  ColumnConfig,
  TransactionRow,
} from '@/types/transactions/transaction.types';
import { TableCell } from './TableCell';

interface TableRowProps<TRow = TransactionRow> {
  row: Row<TRow>;
  columnConfigs: ColumnConfig<TRow>[];
  className?: string;
  onRowClick?: (row: TRow) => void;
  stickyOffsets?: (number | undefined)[];
  stickyEdgeIndex?: number;
}

export function TableRow<TRow = TransactionRow>({
  row,
  columnConfigs,
  className,
  onRowClick,
  stickyOffsets,
  stickyEdgeIndex = -1,
}: TableRowProps<TRow>) {
  return (
    <tr
      className={cn(
        'group bg-white transition-colors duration-150 hover:bg-neutral-50',
        'shadow-[0px_-4px_10px_0px_rgba(0,0,0,0.04)]',
        onRowClick && 'cursor-pointer',
        className
      )}
      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
    >
      {row.getVisibleCells().map((cell, i) => {
        const config = columnConfigs[i];
        if (!config) return null;
        return (
          <TableCell
            key={cell.id}
            data={cell.getValue() as CellData}
            cellType={config.cellType}
            width={config.width}
            stickyLeft={stickyOffsets?.[i]}
            isStickyEdge={i === stickyEdgeIndex}
            customNode={config.renderCell ? config.renderCell(row.original) : undefined}
            onPrimaryClick={
              config.onPrimaryClick ? () => config.onPrimaryClick!(row.original) : undefined
            }
          />
        );
      })}
    </tr>
  );
}
