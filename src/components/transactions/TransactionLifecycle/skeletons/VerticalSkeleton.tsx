export function VerticalSkeleton({ isLast }: { isLast: boolean }) {
  return (
    <div className="flex w-full gap-3">
      <div className="flex flex-col items-center">
        <div className="mt-1 h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-neutral-200" />
        {!isLast && (
          <div
            className="mt-1 flex-1 border-l border-dashed border-[#d0d0d0]"
            style={{ minHeight: 32 }}
          />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex flex-col gap-1 px-4">
          <div className="flex h-5 items-center gap-2.5">
            <span className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
            <span className="h-4 w-14 animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="flex h-5 items-center">
            <span className="h-3 w-40 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
