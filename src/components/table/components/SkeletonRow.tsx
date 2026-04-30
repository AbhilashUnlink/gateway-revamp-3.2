import { cn } from '@/utils/cn';

interface SkeletonRowProps {
  columnCount: number;
  stickyOffsets?: (number | undefined)[];
  stickyEdgeIndex?: number;
}

export function SkeletonRow({
  columnCount,
  stickyOffsets,
  stickyEdgeIndex = -1,
}: SkeletonRowProps) {
  return (
    <tr className="bg-white">
      {Array.from({ length: columnCount }).map((_, i) => {
        const stickyLeft = stickyOffsets?.[i];
        const isSticky = stickyLeft !== undefined;
        const isEdge = i === stickyEdgeIndex;
        return (
          <td
            key={i}
            style={isSticky ? { left: stickyLeft } : undefined}
            className={cn(
              'px-6 py-4 border-b border-[#f0f0f0]',
              isSticky && 'sticky z-10 bg-white',
              isEdge && 'shadow-[8px_0_8px_-6px_rgba(0,0,0,0.12)]'
            )}
          >
            <div className="h-4 rounded bg-neutral-200 animate-pulse" />
            <div className="mt-1.5 h-3 w-2/3 rounded bg-neutral-100 animate-pulse" />
          </td>
        );
      })}
    </tr>
  );
}
