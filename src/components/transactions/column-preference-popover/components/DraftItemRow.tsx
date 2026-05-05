import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { cn } from '@/utils/cn';
import type { RowDragHandleProps } from '@/hooks/useListReorder';
import { isMandatoryId } from '../buildDraft';
import type { DraftItem } from '../types';
import { Toggle } from './Toggle';

interface DraftItemRowProps {
  item: DraftItem;
  idx: number;
  isReadOnly: boolean;
  isDragOver: boolean;
  dragHandleProps: RowDragHandleProps;
  onToggle: (id: string) => void;
}

export function DraftItemRow({
  item,
  isReadOnly,
  isDragOver,
  dragHandleProps,
  onToggle,
}: DraftItemRowProps) {
  const { t } = useTranslation();
  const rowLocked = isReadOnly || isMandatoryId(item.id);
  return (
    <div
      {...dragHandleProps}
      className={cn(
        'flex items-center gap-2.5 py-3',
        isDragOver && !rowLocked && 'rounded ring-1 ring-[#f7941d]'
      )}
    >
      <Button
        type="button"
        variant="icon"
        size="icon"
        aria-label={t('columns.drag_to_reorder')}
        title={t('columns.drag_to_reorder')}
        disabled={rowLocked}
        className={cn(
          'size-4 shrink-0 text-[#808080]',
          rowLocked ? 'cursor-not-allowed opacity-30' : 'cursor-grab hover:text-[#1a1a1a]'
        )}
      >
        <DasIcon name="move" size={14} />
      </Button>
      <span
        className="min-w-0 flex-1 truncate text-sm leading-5 text-[#1a1a1a]"
        title={item.displayName}
      >
        {t(item.labelKey, item.displayName)}
      </span>
      <Toggle
        checked={item.visible}
        disabled={rowLocked}
        onChange={() => onToggle(item.id)}
        ariaLabel={item.displayName}
      />
    </div>
  );
}
