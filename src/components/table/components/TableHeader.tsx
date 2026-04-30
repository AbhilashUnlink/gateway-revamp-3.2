import type { ColumnConfig } from '@/types/transactions/transaction.types';
import { HeaderCell } from './HeaderCell';

interface TableHeaderProps {
  columnConfigs: ColumnConfig[];
  stickyOffsets?: (number | undefined)[];
  stickyEdgeIndex?: number;
}

export function TableHeader({
  columnConfigs,
  stickyOffsets,
  stickyEdgeIndex = -1,
}: TableHeaderProps) {
  return (
    <thead className="sticky top-0 z-20">
      <tr className="bg-[#fff8f0] rounded-tl-2xl rounded-tr-2xl">
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
