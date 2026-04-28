import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';

interface DasDrawerProps {
  children: React.ReactNode;
  onClose?: () => void;
  width?: number;
  topOffset?: number;
  isExiting?: boolean;
}

function DasDrawer({ children, width = 420, topOffset = 200, isExiting = false }: DasDrawerProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const open = mounted && !isExiting;

  return (
    <div className="absolute inset-0 pointer-events-none right-2">
      <div
        className={cn(
          'absolute right-0 bottom-0 pointer-events-auto transition-all duration-300 ease-out will-change-transform',
          open ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        )}
        style={{ top: topOffset, width }}
      >
        {children}
      </div>
    </div>
  );
}

function DasDrawerContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-full w-full flex-col overflow-hidden rounded-tl-2xl rounded-tr-2xl shadow-[0px_0px_30px_0px_rgba(0,0,0,0.25)]',
        className
      )}
      style={{ background: 'linear-gradient(to bottom, #f6e7c9, #fafafa 17.353%)' }}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

function DasDrawerHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex flex-shrink-0 flex-col gap-3', className)}>{children}</div>;
}

function DasDrawerBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('flex-1 overflow-y-auto', className)}>{children}</div>;
}

function DasDrawerFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('flex-shrink-0 p-6', className)}>{children}</div>;
}

DasDrawer.Content = DasDrawerContent;
DasDrawer.Header = DasDrawerHeader;
DasDrawer.Body = DasDrawerBody;
DasDrawer.Footer = DasDrawerFooter;

export default DasDrawer;
