import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <span
      className={cn('inline-block animate-pulse rounded bg-neutral-200', className)}
      aria-hidden
    />
  );
}
