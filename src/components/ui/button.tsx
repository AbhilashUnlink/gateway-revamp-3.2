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
      },

      size: {
        icon: 'p-0',
        sm: 'h-9 px-3 text-xs rounded-xl',
        default: 'h-12 px-4 text-sm font-semibold uppercase rounded-2xl',
        lg: 'h-12 px-6 text-base rounded-2xl',
        'menu-item': 'p-3 rounded-none',
        inline: 'h-auto p-0 text-sm leading-5 rounded-none',
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
