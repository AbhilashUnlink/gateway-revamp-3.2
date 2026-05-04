import { cva, type VariantProps } from 'class-variance-authority';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/utils/cn';

const linkVariants = cva('transition-opacity underline underline-offset-2', {
  variants: {
    variant: {
      card: 'underline-none',
      primary: 'text-[var(--brand-color)] hover:opacity-80',
      subtle: 'text-[var(--text)] hover:opacity-70',
    },

    size: {
      sm: 'text-xs',
      default: 'text-sm',
      lg: 'text-base',
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
});

export interface DasLinkProps extends LinkProps, VariantProps<typeof linkVariants> {}

export function DasLink({ className, variant, size, ...props }: DasLinkProps) {
  return <Link className={cn(linkVariants({ variant, size }), className)} {...props} />;
}
