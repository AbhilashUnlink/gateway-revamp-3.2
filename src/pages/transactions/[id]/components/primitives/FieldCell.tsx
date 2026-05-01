import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

interface FieldCellProps {
  label: string;
  align?: 'start' | 'end';
  className?: string;
  children: ReactNode;
}

export function FieldCell({ label, align = 'start', className, children }: FieldCellProps) {
  return (
    <div className={cn('flex flex-col gap-1', align === 'end' && 'items-end', className)}>
      <span className="text-sm leading-5 text-[#808080]">{label}</span>
      {typeof children === 'string' ? (
        <span className="truncate text-sm leading-5 text-[#1a1a1a]">{children}</span>
      ) : (
        children
      )}
    </div>
  );
}
