import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { DasIcon } from '@/components/ui/DasIcon';
import { Button } from '@/components/ui/button';

// ── Root ──────────────────────────────────────────────────────────────────

interface PageBarProps {
  children: ReactNode;
  className?: string;
}

export function PageBar({ children, className }: PageBarProps) {
  return <div className={cn('flex items-start gap-2 pt-6', className)}>{children}</div>;
}

// ── Title ─────────────────────────────────────────────────────────────────

interface PageBarTitleProps {
  children: ReactNode;
  className?: string;
}

function PageBarTitle({ children, className }: PageBarTitleProps) {
  return (
    <div
      className={cn(
        'flex flex-1 items-center h-[32px] min-w-0 border-l-4 px-2 mt-2 border-[#f7941d]',
        className
      )}
    >
      <h1 className="text-[24px] font-semibold leading-none text-[#1a1a1a] truncate">{children}</h1>
    </div>
  );
}

// ── Actions ───────────────────────────────────────────────────────────────

interface PageBarActionsProps {
  children: ReactNode;
  gap?: 'sm' | 'md';
  className?: string;
}

function PageBarActions({ children, gap = 'sm', className }: PageBarActionsProps) {
  return (
    <div className={cn('flex shrink-0 items-center', gap === 'sm' ? 'gap-2' : 'gap-3', className)}>
      {children}
    </div>
  );
}

// ── StatsPill ─────────────────────────────────────────────────────────────

interface PageBarStatsPillProps {
  children: ReactNode;
  className?: string;
}

function PageBarStatsPill({ children, className }: PageBarStatsPillProps) {
  return (
    <div
      className={cn(
        'flex h-[48px] items-stretch gap-0',
        'bg-[#fff6e6] border border-white rounded-2xl px-4 py-[10px]',
        'drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]',
        className
      )}
    >
      {children}
    </div>
  );
}

// ── StatItem ──────────────────────────────────────────────────────────────

interface PageBarStatItemProps {
  label: string;
  value: string;
  currencyPrefix?: string;
  className?: string;
}

function PageBarStatItem({ label, value, currencyPrefix, className }: PageBarStatItemProps) {
  return (
    <div
      className={cn('flex flex-col items-start justify-between h-full px-3 -mt-[7px]', className)}
    >
      <span className="text-xs font-medium leading-5 text-[#f7941d] uppercase whitespace-nowrap">
        {label}
      </span>
      <span className="text-xs leading-5 text-[#1a1a1a] whitespace-nowrap">
        {currencyPrefix && <span className="font-normal">{currencyPrefix} </span>}
        <span className="font-semibold">{value}</span>
      </span>
    </div>
  );
}

// ── FilterButton ──────────────────────────────────────────────────────────

interface PageBarFilterButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  count?: number;
  label: string;
}

const PageBarFilterButton = forwardRef<HTMLButtonElement, PageBarFilterButtonProps>(
  function PageBarFilterButton({ count = 0, label, className, ...props }, ref) {
    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        className={cn(
          'gap-2 px-4 text-[14px] drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)] hover:opacity-80',
          className
        )}
        {...props}
      >
        <div className="relative shrink-0">
          <DasIcon name="sliders-horizontal" size={20} className="text-[#1a1a1a]" />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-sm bg-[#1a1a1a] px-0.5 text-[10px] font-semibold leading-none text-white">
              {count}
            </span>
          )}
        </div>
        <span className="whitespace-nowrap">{label}</span>
      </Button>
    );
  }
);

// ── ActionButton ──────────────────────────────────────────────────────────

interface PageBarActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

const PageBarActionButton = forwardRef<HTMLButtonElement, PageBarActionButtonProps>(
  function PageBarActionButton({ children, className, ...props }, ref) {
    return (
      <Button
        ref={ref}
        type="button"
        variant="ghost"
        size="icon"
        className={cn(
          'size-[48px] shrink-0 rounded-2xl text-[#1a1a1a] hover:opacity-80',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

// ── Attach sub-components ─────────────────────────────────────────────────

PageBar.Title = PageBarTitle;
PageBar.Actions = PageBarActions;
PageBar.StatsPill = PageBarStatsPill;
PageBar.StatItem = PageBarStatItem;
PageBar.FilterButton = PageBarFilterButton;
PageBar.ActionButton = PageBarActionButton;
