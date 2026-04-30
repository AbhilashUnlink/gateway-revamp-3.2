import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CopyButtonProps {
  /** The string value to copy. The button does nothing when this is empty. */
  value?: string | number | null;
  /** Icon size in px. Matches the table's default. */
  size?: number;
  /** Aria label for the button (defaults to "Copy"). */
  ariaLabel?: string;
  /** Extra classes appended to the button — useful for tweaking color in custom contexts. */
  className?: string;
}

/**
 * Single source of truth for the copy-to-clipboard action across tables, drawers
 * and info panels. Renders a Copy icon that flips to a green Check for ~1.5s
 * after a successful copy.
 *
 * Always swallows pointer events on the parent (e.g. a clickable row) via
 * `stopPropagation` so copying never accidentally triggers row navigation.
 */
export function CopyButton({ value, size = 14, ariaLabel = 'Copy', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const text = value === null || value === undefined ? '' : String(value);
  const disabled = text.length === 0;

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (disabled) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        'shrink-0 text-neutral-400 transition-colors hover:text-[#f7941d] focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-40',
        className
      )}
    >
      {copied ? <Check size={size} className="text-[#1e8f1f]" /> : <Copy size={size} />}
    </button>
  );
}
