import { cn } from '@/utils/cn';

interface AuthHeadingProps {
  children: React.ReactNode;
  className?: string;
}

function AuthHeading({ children, className }: AuthHeadingProps) {
  return <div className={cn('flex flex-col gap-3', className)}>{children}</div>;
}

function AuthHeadingTitle({ children, className }: AuthHeadingProps) {
  return (
    <p className={cn('text-2xl font-semibold leading-normal text-white', className)}>{children}</p>
  );
}

function AuthHeadingDescription({ children, className }: AuthHeadingProps) {
  return <p className={cn('text-sm leading-5 text-white', className)}>{children}</p>;
}

AuthHeading.Title = AuthHeadingTitle;
AuthHeading.Description = AuthHeadingDescription;

export default AuthHeading;
