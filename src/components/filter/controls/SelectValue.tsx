import type { FilterFieldOption } from '../types';

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: FilterFieldOption[];
  placeholder?: string;
}

export function SelectValue({ value, onChange, options, placeholder }: Props) {
  return (
    <select
      className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="" disabled>
        {placeholder ?? 'Select…'}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
