import { Fragment, type ComponentPropsWithoutRef, type ElementType, type ReactNode } from 'react';
import { Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';

// ── Types ─────────────────────────────────────────────────────────────────

interface DasPopoverProps {
  children: React.ReactNode;
  className?: string;
}

type DasPopoverTriggerOwnProps = {
  children?: ReactNode;
  className?: string;
};

/**
 * Polymorphic over `as` — additional props are typed against the chosen
 * element (defaults to `<button>`), so e.g. `as={PageBar.FilterButton}`
 * accepts that component's own props (label, count, …).
 */
type DasPopoverTriggerProps<T extends ElementType = 'button'> = DasPopoverTriggerOwnProps & {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, keyof DasPopoverTriggerOwnProps | 'as'>;

type PopoverPanelRenderProps = { open: boolean; close: () => void };

interface DasPopoverContentProps {
  children: React.ReactNode | ((bag: PopoverPanelRenderProps) => React.ReactNode);
  className?: string;
  align?: 'left' | 'right';
}

// ── Root ──────────────────────────────────────────────────────────────────

function DasPopover({ children, className }: DasPopoverProps) {
  return <Popover className={cn('relative', className)}>{children}</Popover>;
}

// ── Sub Components ────────────────────────────────────────────────────────

function DasPopoverTrigger<T extends ElementType = 'button'>({
  children,
  className,
  as,
  ...rest
}: DasPopoverTriggerProps<T>) {
  return (
    <PopoverButton
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      as={as as any}
      className={cn('focus:outline-none', className)}
      {...(rest as object)}
    >
      {children}
    </PopoverButton>
  );
}

function DasPopoverContent({ children, align = 'left', className }: DasPopoverContentProps) {
  return (
    <Transition
      as={Fragment}
      enter="transition ease-out duration-200"
      enterFrom="opacity-0 translate-y-1"
      enterTo="opacity-100 translate-y-0"
      leave="transition ease-in duration-150"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 translate-y-1"
    >
      <PopoverPanel
        className={cn(
          'absolute top-full z-50 mt-2',
          'overflow-hidden rounded-lg border border-[#e5e5e5] bg-white',
          'shadow-[0px_4px_10px_rgba(0,0,0,0.1)]',
          align === 'right' ? 'right-0' : 'left-0',
          className
        )}
      >
        {children as React.ReactNode}
      </PopoverPanel>
    </Transition>
  );
}

// ── Compound Assignment (LIKE AuthHeading) ────────────────────────────────

DasPopover.Trigger = DasPopoverTrigger;
DasPopover.Content = DasPopoverContent;

export default DasPopover;
