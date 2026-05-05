export function HorizontalSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-3.5 items-center gap-2">
        <span className="ml-[3px] inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-neutral-200" />
        <span className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="flex h-5 items-center gap-3 pl-3">
        <span className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
        <span className="h-3 w-28 animate-pulse rounded bg-neutral-100" />
      </div>
    </div>
  );
}
