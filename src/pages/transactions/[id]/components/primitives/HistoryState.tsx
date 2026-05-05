import { type ReactNode } from 'react';
import { DasSpinner } from '@/components/ui/das-spinner';

type Variant = 'loading' | 'error' | 'empty';

interface HistoryStateProps {
  variant: Variant;
  children: ReactNode;
}

export function HistoryState({ variant, children }: HistoryStateProps) {
  const tone = variant === 'error' ? 'text-[#ff4343]' : 'text-[#808080]';
  return (
    <div className={`flex items-center justify-center gap-2 py-8 text-sm ${tone}`}>
      {variant === 'loading' && <DasSpinner />}
      {children}
    </div>
  );
}
