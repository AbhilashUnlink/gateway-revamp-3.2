import { cn } from '@/utils/cn';
import { DasIcon } from '@/components/ui/das-icon';

interface DasSpinnerProps {
  size?: number;
  className?: string;
}

export function DasSpinner({ size = 16, className }: DasSpinnerProps) {
  return (
    <DasIcon name="loader-2" size={size} className={cn('animate-spin', className)} aria-hidden />
  );
}
