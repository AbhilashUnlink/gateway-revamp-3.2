interface Props {
  value: { from?: string; to?: string };
  onChange: (v: { from?: string; to?: string }) => void;
}

export function DateRangeValue({ value, onChange }: Props) {
  const { from = '', to = '' } = value ?? {};
  return (
    <div className="flex w-full items-center gap-2">
      <input
        type="date"
        value={from}
        onChange={(e) => onChange({ from: e.target.value, to })}
        className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
      />
      <span className="text-sm text-[#808080]">–</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onChange({ from, to: e.target.value })}
        className="h-10 w-full rounded-lg border border-[#e5e5e5] bg-white px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#1a1a1a]"
      />
    </div>
  );
}
