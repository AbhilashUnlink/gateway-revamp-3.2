import { cn } from '@/utils/cn';
import { Toggle } from './Toggle';

interface PredefinedRowProps {
  label: string;
  selected: boolean;
  onSelect: () => void;
}

export function PredefinedRow({ label, selected, onSelect }: PredefinedRowProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn('row-card cursor-pointer text-left', selected && 'is-selected')}
    >
      <span className="min-w-0 flex-1 truncate text-sm leading-5 text-[#1a1a1a]" title={label}>
        {label}
      </span>
      <Toggle checked={selected} onChange={() => onSelect()} ariaLabel={label} />
    </button>
  );
}
