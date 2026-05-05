import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

interface WrapperProps {
  uuid: string;
  isActive: boolean;
  className: string;
  onSelect?: (uuid: string) => void;
  children: ReactNode;
}

export function ItemWrapper({ uuid, isActive, className, onSelect, children }: WrapperProps) {
  if (onSelect) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={cn('cursor-pointer', className)}
        onClick={() => {
          if (!isActive) onSelect(uuid);
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isActive) {
            e.preventDefault();
            onSelect(uuid);
          }
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <Link to={`/transactions/${uuid}`} className={className}>
      {children}
    </Link>
  );
}
