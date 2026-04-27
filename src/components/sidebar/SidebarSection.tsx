import React from 'react';
import { cn } from '@/utils/cn';

interface SidebarSectionProps {
  label?: string;
  children: React.ReactNode;
  collapsed: boolean;
  className?: string;
}

export function SidebarSection({ label, children, collapsed, className }: SidebarSectionProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {label && !collapsed && (
        <span className="px-[18px] py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">
          {label}
        </span>
      )}
      {children}
    </div>
  );
}
