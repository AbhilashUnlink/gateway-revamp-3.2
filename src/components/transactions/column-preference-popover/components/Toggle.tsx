import { cn } from '@/utils/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  ariaLabel?: string;
}

/** Matches Figma 28×16 brand pill. */
export function Toggle({ checked, onChange, disabled, ariaLabel }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!checked);
      }}
      className={cn(
        'relative h-4 w-7 shrink-0 rounded-full transition-colors',
        checked ? 'bg-[#f7941d]' : 'border border-[#e5e5e5] bg-white',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <span
        className={cn(
          'absolute h-3 w-3 rounded-full shadow-[0_2px_4px_rgba(39,39,39,0.1)] transition-all',
          // The off-state has a 1px border (box-sizing: border-box), which
          // shrinks the content box; offset the knob by 1px less to keep it
          // visually centered.
          checked ? 'left-[14px] top-[2px] bg-white' : 'left-[1px] top-[1px] bg-[#f7941d]'
        )}
      />
    </button>
  );
}
