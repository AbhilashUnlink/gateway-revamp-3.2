import { cn } from '@/utils/cn';
import type { CellData, CellType } from '@/types/transactions/transaction.types';
import { cellRendererMap } from '../utils/cellRendererMap';

interface TableCellProps {
  data: CellData;
  cellType: CellType;
  width: number;
  className?: string;
}

export function TableCell({ data, cellType, width, className }: TableCellProps) {
  return (
    <td
      style={{ width, minWidth: width }}
      className={cn('px-6 py-4 align-top border-b border-[#f0f0f0]', className)}
    >
      {cellRendererMap[cellType](data)}
    </td>
  );
}
