import { cn } from '@/utils/cn';

interface RadioProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export function Radio({ label, checked, onChange }: RadioProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <span
        className={cn(
          'relative h-5 w-5 rounded-full border bg-white',
          checked ? 'border-[#f7941d]' : 'border-[#e5e5e5]'
        )}
      >
        {checked && (
          <span className="absolute inset-1 rounded-full bg-[#f7941d]" aria-hidden="true" />
        )}
      </span>
      <span className="text-sm text-[#1a1a1a]">{label}</span>
      <input
        type="radio"
        className="sr-only"
        checked={checked}
        onChange={onChange}
        aria-label={label}
      />
    </label>
  );
}
