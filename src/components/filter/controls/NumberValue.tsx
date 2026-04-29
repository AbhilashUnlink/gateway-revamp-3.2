interface Props {
  value: string | number;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function NumberValue({ value, onChange, placeholder }: Props) {
  return (
    <input
      type="number"
      className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
    />
  );
}
