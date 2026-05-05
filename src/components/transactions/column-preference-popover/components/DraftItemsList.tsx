import type { RowDragHandleProps } from '@/hooks/useListReorder';
import type { DraftItem } from '../types';
import { DraftItemRow } from './DraftItemRow';

interface DraftItemsListProps {
  filteredDraft: { item: DraftItem; idx: number }[];
  isReadOnly: boolean;
  dragOverIdx: number | null;
  getRowProps: (idx: number) => RowDragHandleProps;
  onToggle: (id: string) => void;
}

export function DraftItemsList({
  filteredDraft,
  isReadOnly,
  dragOverIdx,
  getRowProps,
  onToggle,
}: DraftItemsListProps) {
  if (filteredDraft.length === 0) {
    return <div className="py-8 text-center text-xs text-[#808080]">—</div>;
  }
  return (
    <div className="-mr-1 flex-1 overflow-y-auto pr-1">
      {filteredDraft.map(({ item, idx }) => (
        <DraftItemRow
          key={item.id}
          item={item}
          idx={idx}
          isReadOnly={isReadOnly}
          isDragOver={dragOverIdx === idx}
          dragHandleProps={getRowProps(idx)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
