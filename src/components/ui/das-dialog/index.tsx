import { Fragment, useEffect, type ReactNode } from 'react';
import { Transition } from '@headlessui/react';
import { cn } from '@/utils/cn';

// ── Types ────────────────────────────────────────────────────────────────

type Size = 'sm' | 'md' | 'lg';

interface DasDialogProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Width preset. Defaults to `md` (28rem). */
  size?: Size;
  className?: string;
}

interface DasDialogSubProps {
  children: ReactNode;
  className?: string;
}

const SIZE_CLASS: Record<Size, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

// ── Root ─────────────────────────────────────────────────────────────────
//
// Renders inline (no portal) so the dialog stays in the React tree of its
// caller — important when the dialog opens from inside a popover panel,
// where headless-UI uses DOM-tree containment to decide outside-clicks.
// Visual positioning is `position: fixed`, so it still covers the viewport
// regardless of where it sits in the tree.

function DasDialog({ open, onClose, children, size = 'md', className }: DasDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <Transition show={open} as={Fragment}>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
        </Transition.Child>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className={cn(
              'relative w-full transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all',
              SIZE_CLASS[size],
              className
            )}
          >
            {children}
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}

// ── Sub-components ───────────────────────────────────────────────────────

function DasDialogTitle({ children, className }: DasDialogSubProps) {
  return <h4 className={cn('text-lg font-semibold text-[#1a1a1a]', className)}>{children}</h4>;
}

function DasDialogBody({ children, className }: DasDialogSubProps) {
  return <div className={cn('mt-2 text-sm text-[#808080]', className)}>{children}</div>;
}

function DasDialogActions({ children, className }: DasDialogSubProps) {
  return <div className={cn('mt-5 flex justify-end gap-3', className)}>{children}</div>;
}

DasDialog.Title = DasDialogTitle;
DasDialog.Body = DasDialogBody;
DasDialog.Actions = DasDialogActions;

export default DasDialog;
