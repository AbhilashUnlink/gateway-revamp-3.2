import type { ColumnConfig } from '@/types/transactions/transaction.types';
import { HeaderCell } from './HeaderCell';
import { cn } from '@/utils/cn';

interface TableHeaderProps<TRow = unknown> {
  columnConfigs: ColumnConfig<TRow>[];
  stickyOffsets?: (number | undefined)[];
  stickyEdgeIndex?: number;
  backgroundColor?: string;
}

export function TableHeader<TRow = unknown>({
  columnConfigs,
  stickyOffsets,
  stickyEdgeIndex = -1,
  backgroundColor = '',
}: TableHeaderProps<TRow>) {
  return (
    <thead className="sticky top-0 z-20">
      <tr className={cn('rounded-tl-2xl rounded-tr-2xl', backgroundColor)}>
        {columnConfigs.map((col, i) => (
          <HeaderCell
            key={col.id}
            config={col}
            stickyLeft={stickyOffsets?.[i]}
            isStickyEdge={i === stickyEdgeIndex}
          />
        ))}
      </tr>
    </thead>
  );
}
