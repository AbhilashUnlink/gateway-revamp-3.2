import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { CellData, CellType } from '@/types/transactions/transaction.types';
import { cellRendererMap } from '../utils/cellRendererMap';

interface TableCellProps {
  data: CellData;
  cellType: CellType;
  width: number;
  className?: string;
  onPrimaryClick?: () => void;
  /** Custom node from `ColumnConfig.renderCell` — overrides cellType when set. */
  customNode?: ReactNode;
  /** When set, this cell is pinned `left: <offset>px` while the table scrolls. */
  stickyLeft?: number;
  /** Last sticky column — renders a right-edge shadow to separate from scroll area. */
  isStickyEdge?: boolean;
}

export function TableCell({
  data,
  cellType,
  width,
  className,
  onPrimaryClick,
  customNode,
  stickyLeft,
  isStickyEdge,
}: TableCellProps) {
  const isSticky = stickyLeft !== undefined;
  return (
    <td
      style={{ width, minWidth: width, ...(isSticky ? { left: stickyLeft } : null) }}
      className={cn(
        'px-6 py-4 align-top border-b border-[#f0f0f0]',
        isSticky && 'sticky z-10 bg-white group-hover:bg-neutral-50',
        isStickyEdge && 'shadow-[8px_0_8px_-6px_rgba(0,0,0,0.12)]',
        className
      )}
    >
      {customNode ?? cellRendererMap[cellType](data, onPrimaryClick)}
    </td>
  );
}
