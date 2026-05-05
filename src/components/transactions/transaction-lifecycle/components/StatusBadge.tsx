export function StatusBadge({ type }: { type: string }) {
  const label = type.charAt(0) + type.slice(1).toLowerCase();
  return (
    <span className="rounded bg-[#c6f3da] px-1 py-0.5 text-xs font-medium uppercase text-[#1e8f1f]">
      {label}
    </span>
  );
}
