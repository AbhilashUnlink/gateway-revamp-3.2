interface SkeletonRowProps {
  columnCount: number;
}

export function SkeletonRow({ columnCount }: SkeletonRowProps) {
  return (
    <tr className="bg-white">
      {Array.from({ length: columnCount }).map((_, i) => (
        <td key={i} className="px-6 py-4 border-b border-[#f0f0f0]">
          <div className="h-4 rounded bg-neutral-200 animate-pulse" />
          <div className="mt-1.5 h-3 w-2/3 rounded bg-neutral-100 animate-pulse" />
        </td>
      ))}
    </tr>
  );
}
