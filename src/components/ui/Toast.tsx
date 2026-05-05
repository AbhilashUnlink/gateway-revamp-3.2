import { toast } from 'react-hot-toast';
import type { Toast } from 'react-hot-toast';
import { cn } from '@/utils/cn';
import { DasIcon, type DasIconName } from './DasIcon';
import { Button } from './button';

// ── Variant config ────────────────────────────────────────────────────────

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

const VARIANT_STYLES: Record<
  ToastVariant,
  { bg: string; border: string; text: string; icon: DasIconName }
> = {
  success: {
    bg: 'bg-[#c6f3da]',
    border: 'border-[#1e8f1f]',
    text: 'text-[#1e8f1f]',
    icon: 'check-circle',
  },
  error: {
    bg: 'bg-[#fde8e8]',
    border: 'border-[#e53935]',
    text: 'text-[#e53935]',
    icon: 'x-circle',
  },
  warning: {
    bg: 'bg-[#fff6e6]',
    border: 'border-[#f7941d]',
    text: 'text-[#f7941d]',
    icon: 'alert-circle',
  },
  info: {
    bg: 'bg-[#e3f2fd]',
    border: 'border-[#1565c0]',
    text: 'text-[#1565c0]',
    icon: 'info',
  },
};

// ── Props ─────────────────────────────────────────────────────────────────

export interface ToastCardProps {
  t: Toast;
  variant: ToastVariant;
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
}

// ── Component ─────────────────────────────────────────────────────────────

export function ToastCard({ t, variant, title, description, action }: ToastCardProps) {
  const { bg, border, text, icon } = VARIANT_STYLES[variant];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      onKeyDown={(e) => e.key === 'Escape' && toast.dismiss(t.id)}
      tabIndex={0}
      className={cn(
        'flex min-w-72 max-w-sm flex-col gap-1.5 rounded-2xl border p-2.5',
        'shadow-sm outline-none',
        'transition-all duration-300 ease-out focus-visible:ring-2',
        bg,
        border,
        t.visible ? 'translate-y-0 opacity-100' : '-translate-y-1 opacity-0 pointer-events-none'
      )}
    >
      {/* Main row: icon + title + close */}
      <div className="flex items-center gap-3">
        <DasIcon name={icon} size={20} className={cn('shrink-0', text)} aria-hidden="true" />

        <p className={cn('flex-1 text-xs font-semibold leading-snug', text)}>{title}</p>

        <Button
          type="button"
          variant="icon"
          size="icon"
          aria-label="Dismiss notification"
          onClick={() => toast.dismiss(t.id)}
          className={cn('shrink-0 rounded-md p-0.5 hover:opacity-60', text)}
        >
          <DasIcon name="x" size={14} />
        </Button>
      </div>

      {/* Optional description */}
      {description && (
        <p className={cn('pl-8 text-xs font-normal leading-snug opacity-80', text)}>
          {description}
        </p>
      )}

      {/* Optional action */}
      {action && (
        <div className="pl-8">
          <Button
            type="button"
            variant="link"
            size="inline"
            onClick={() => {
              action.onClick();
              toast.dismiss(t.id);
            }}
            className={cn('text-xs font-semibold underline-offset-2 rounded', text)}
          >
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}
