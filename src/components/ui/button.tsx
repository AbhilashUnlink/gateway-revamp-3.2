import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'w-full cursor-pointer border-0 bg-[var(--btn-primary)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover)] disabled:cursor-not-allowed disabled:opacity-60',

        link: 'bg-transparent hover:underline shadow-none rounded-none border-none cursor-pointer',
      },

      size: {
        sm: 'h-9 px-3 text-xs rounded-xl',
        default: 'h-12 px-4 text-sm font-semibold uppercase rounded-2xl',
        lg: 'h-12 px-6 text-base rounded-2xl',
      },
    },

    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
