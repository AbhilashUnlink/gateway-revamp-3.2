import type { ColumnConfig } from '@/types/transactions/transaction.types';
import { HeaderCell } from './HeaderCell';

interface TableHeaderProps {
  columnConfigs: ColumnConfig[];
}

export function TableHeader({ columnConfigs }: TableHeaderProps) {
  return (
    <thead className="sticky top-0 z-10">
      <tr className="bg-[#fff8f0] rounded-tl-2xl rounded-tr-2xl">
        {columnConfigs.map((col) => (
          <HeaderCell key={col.id} config={col} />
        ))}
      </tr>
    </thead>
  );
}
