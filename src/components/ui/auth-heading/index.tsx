import { cn } from '@/utils/cn';

interface AuthHeadingProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthHeadingRoot({ children, className }: AuthHeadingProps) {
  return <div className={cn('flex flex-col gap-3', className)}>{children}</div>;
}

export function AuthHeadingTitle({ children, className }: AuthHeadingProps) {
  return (
    <p className={cn('text-2xl font-semibold leading-normal text-white', className)}>{children}</p>
  );
}

export function AuthHeadingDescription({ children, className }: AuthHeadingProps) {
  return <p className={cn('text-sm leading-5 text-white', className)}>{children}</p>;
}
