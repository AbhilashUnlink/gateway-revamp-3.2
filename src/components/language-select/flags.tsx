import { cn } from '@/utils/cn';

interface FlagProps {
  className?: string;
}

export function FlagJP({ className }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 20"
      className={cn('rounded-sm', className)}
      aria-hidden="true"
    >
      <rect width="30" height="20" fill="#fff" />
      <circle cx="15" cy="10" r="6" fill="#BC002D" />
    </svg>
  );
}

export function FlagGB({ className }: FlagProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 60 30"
      className={cn('rounded-sm', className)}
      aria-hidden="true"
    >
      <rect width="60" height="30" fill="#012169" />
      {/* St Andrew's cross — white */}
      <path d="M0 0 60 30M60 0 0 30" stroke="#fff" strokeWidth="6" />
      {/* St Patrick's cross — red (simplified, no offset) */}
      <path d="M0 0 60 30M60 0 0 30" stroke="#C8102E" strokeWidth="4" />
      {/* St George's cross — white */}
      <path d="M30 0V30M0 15H60" stroke="#fff" strokeWidth="10" />
      {/* St George's cross — red */}
      <path d="M30 0V30M0 15H60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}
