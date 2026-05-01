import { cn } from '@/utils/cn';
import type { BadgeTone } from '../../types';

interface StatusBadgeProps {
  label: string;
  tone?: BadgeTone;
  className?: string;
}

const TONE_CLASS: Record<BadgeTone, string> = {
  success: 'bg-[#c6f3da] text-[#1e8f1f]',
  error: 'bg-[#ffe2e2] text-[#ff4343]',
  neutral: 'border border-[#e5e5e5] text-[#1a1a1a]',
};

export function StatusBadge({ label, tone = 'neutral', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded px-1 py-0.5 text-xs font-medium uppercase leading-none',
        TONE_CLASS[tone],
        className
      )}
    >
      {label}
    </span>
  );
}
