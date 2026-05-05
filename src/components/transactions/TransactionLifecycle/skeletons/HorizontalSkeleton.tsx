import { Skeleton } from '@/components/ui/Skeleton';

export function HorizontalSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-3.5 items-center gap-2">
        <Skeleton className="ml-[3px] h-2 w-2 shrink-0 rounded-full" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex h-5 items-center gap-3 pl-3">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-28 bg-neutral-100" />
      </div>
    </div>
  );
}
