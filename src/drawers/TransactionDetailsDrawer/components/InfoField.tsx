import type { ReactNode } from 'react';
import { CopyButton } from '@/components/ui/CopyButton';

interface InfoFieldProps {
  label: string;
  value?: string | number | null;
  copyable?: boolean;
  children?: ReactNode;
}

export function InfoField({ label, value, copyable, children }: InfoFieldProps) {
  const displayValue = value !== undefined && value !== null ? String(value) : 'N/A';

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-[#808080]">{label}</span>
      <div className="flex items-center gap-2">
        {children ?? <span className="text-sm text-[#1a1a1a]">{displayValue}</span>}
        {copyable && displayValue !== 'N/A' && <CopyButton value={displayValue} />}
      </div>
    </div>
  );
}

export function InfoGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-3 gap-y-4 w-full">{children}</div>;
}
