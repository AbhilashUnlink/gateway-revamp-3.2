/* eslint-disable react-refresh/only-export-components */
import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { TimelineDot } from './TimelineDot';

interface HistoryCardRootProps {
  active?: boolean;
  children: ReactNode;
  className?: string;
}

function Root({ active = false, children, className }: HistoryCardRootProps) {
  return (
    <div className={cn('flex w-[453px] shrink-0 flex-col gap-2', className)} data-active={active}>
      {children}
    </div>
  );
}

interface HeaderProps {
  active?: boolean;
  children: ReactNode;
}

function Header({ active = false, children }: HeaderProps) {
  return (
    <div className="flex items-center gap-2">
      <TimelineDot active={active} />
      {children}
    </div>
  );
}

interface BodyProps {
  active?: boolean;
  children: ReactNode;
  className?: string;
}

function Body({ active = false, children, className }: BodyProps) {
  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-2xl border',
        active ? 'border-[#f7941d] bg-[#fff6e6]' : 'border-[#e5e5e5] bg-white',
        className
      )}
    >
      {children}
    </div>
  );
}

interface GridProps {
  children: ReactNode;
  columns?: 1 | 2;
}

function Grid({ children, columns = 2 }: GridProps) {
  return (
    <div className={cn('grid gap-x-3 gap-y-3 p-4', columns === 2 ? 'grid-cols-2' : 'grid-cols-1')}>
      {children}
    </div>
  );
}

interface FooterProps {
  children: ReactNode;
}

function Footer({ children }: FooterProps) {
  return <div className="flex flex-col gap-1 bg-[#fafafa] p-4">{children}</div>;
}

export const HistoryCard = { Root, Header, Body, Grid, Footer };
