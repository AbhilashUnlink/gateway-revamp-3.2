import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { DasIcon, type DasIconName } from '@/components/ui/das-icon';
import { cn } from '@/utils/cn';

type Variant = 'soft' | 'gradient';

interface DasPopoverHeaderProps {
  icon: DasIconName;
  title: string;
  onClose: () => void;
  closeAriaLabel: string;
  /** Visual style — `soft` (solid `#fff6e6`, used by Download/Columns) or `gradient` (used by Filter). */
  variant?: Variant;
  /** Optional badge rendered on top of the icon circle (e.g., active filter count). */
  iconBadge?: ReactNode;
  className?: string;
}

const VARIANT_CONTAINER: Record<Variant, string> = {
  soft: 'h-[66px] rounded-t-2xl bg-[#fff6e6]',
  gradient: 'h-16 bg-gradient-to-r from-[#fce4cc] via-[#fef1e0] to-white',
};

const VARIANT_ICON_SIZE: Record<Variant, number> = {
  soft: 16,
  gradient: 14,
};

export function DasPopoverHeader({
  icon,
  title,
  onClose,
  closeAriaLabel,
  variant = 'soft',
  iconBadge,
  className,
}: DasPopoverHeaderProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center gap-2 px-4 py-1.5',
        VARIANT_CONTAINER[variant],
        className
      )}
    >
      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white">
        <DasIcon name={icon} size={VARIANT_ICON_SIZE[variant]} className="text-[#1a1a1a]" />
        {iconBadge !== undefined && iconBadge !== null && (
          <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded bg-[#1a1a1a] text-[8px] font-semibold leading-none text-white">
            {iconBadge}
          </span>
        )}
      </div>
      <h3 className="flex-1 text-base font-semibold leading-5 text-[#1a1a1a]">{title}</h3>
      <Button
        type="button"
        variant="icon"
        size="icon"
        onClick={onClose}
        aria-label={closeAriaLabel}
      >
        <DasIcon name="circle-x" size={24} strokeWidth={1.5} />
      </Button>
    </div>
  );
}
