import { cn } from '@/utils/cn';

interface TimelineDotProps {
  active?: boolean;
  className?: string;
}

export function TimelineDot({ active = false, className }: TimelineDotProps) {
  return (
    <span
      className={cn(
        'inline-block rounded-full',
        active ? 'h-3.5 w-3.5 bg-[#f7941d]' : 'h-2 w-2 bg-[#d0d0d0]',
        className
      )}
    />
  );
}
