import { forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/cn';

const buttonVariants = cva(
  'inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary:
          'w-full cursor-pointer border-0 bg-[var(--brand-color)] text-[#ffffff] hover:bg-[var(--brand-color-hover)] disabled:cursor-not-allowed disabled:opacity-60',
        ghost: 'bg-white text-[#1a1a1a] shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)] hover:opacity-90',
        outline:
          'border border-[#f7941d] bg-white text-[#f7941d] shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)] hover:opacity-90',
        icon: 'bg-transparent text-[#1a1a1a] hover:opacity-70',
        link: 'bg-transparent hover:underline shadow-none rounded-none border-none cursor-pointer',
        'language-option':
          'w-full justify-start gap-2 border-b border-[#e5e5e5] last:border-b-0 text-sm text-[#1a1a1a] hover:bg-brand-light data-[selected=true]:bg-brand-light',
        'field-link':
          'bg-transparent text-left font-semibold text-[#1a1a1a] underline hover:text-brand cursor-pointer',
        dark: 'bg-[#1a1a1a] text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40',
        subtle: 'bg-transparent text-[#1a1a1a] hover:bg-[#fafafa]',
        chip: 'border border-[#e5e5e5] bg-white text-[#1a1a1a] hover:border-[#1a1a1a] hover:bg-[#fafafa] disabled:cursor-not-allowed disabled:opacity-40',
        'menu-row':
          'w-full justify-start gap-2 border-t border-[#e5e5e5] text-sm text-[#1a1a1a] hover:bg-neutral-50',
        danger:
          'bg-[#ff4343] text-white hover:bg-[#e23838] disabled:cursor-not-allowed disabled:opacity-60',
      },

      size: {
        icon: 'p-0',
        xs: 'h-8 px-2.5 text-xs font-medium rounded-lg',
        sm: 'h-9 px-3 text-xs rounded-xl',
        default: 'h-12 px-4 text-sm font-semibold uppercase rounded-2xl',
        lg: 'h-12 px-6 text-base rounded-2xl',
        'menu-item': 'p-3 rounded-none',
        'menu-row': 'px-3 py-5 rounded-none',
        inline: 'h-auto p-0 text-sm leading-5 rounded-none',
        pill: 'h-8 px-3 text-xs font-medium rounded-full',
        compact: 'rounded-lg px-3 py-1.5 text-sm',
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant, size, ...props },
  ref
) {
  return (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
});
