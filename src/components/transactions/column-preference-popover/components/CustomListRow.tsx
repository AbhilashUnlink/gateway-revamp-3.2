import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { cn } from '@/utils/cn';
import { Toggle } from './Toggle';

interface CustomListRowProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  deleteDisabled: boolean;
  deleteTitle: string;
}

export function CustomListRow({
  label,
  selected,
  onSelect,
  onDelete,
  deleteDisabled,
  deleteTitle,
}: CustomListRowProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn('row-card group cursor-pointer', selected && 'is-selected')}
    >
      <span className="min-w-0 flex-1 truncate text-sm leading-5 text-[#1a1a1a]" title={label}>
        {label}
      </span>
      <Button
        type="button"
        variant="icon"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        disabled={deleteDisabled}
        aria-label="Delete"
        title={deleteTitle}
        className="text-[#f7941d] hover:text-[#ff4343] hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
      >
        <DasIcon name="trash-2" size={20} />
      </Button>
      <Toggle checked={selected} onChange={() => onSelect()} ariaLabel={label} />
    </div>
  );
}
