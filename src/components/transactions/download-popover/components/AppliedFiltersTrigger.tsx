import DasPopover from '@/components/ui/das-popover';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/das-icon';
import { cn } from '@/utils/cn';
import type { AppliedFilterEntry } from '../types';

interface AppliedFiltersTriggerProps {
  entries: AppliedFilterEntry[];
  disabled: boolean;
  label: string;
  title: string;
  closeLabel: string;
}

/** Underlined-link trigger that reveals the applied filter list in a small popover. */
export function AppliedFiltersTrigger({
  entries,
  disabled,
  label,
  title,
  closeLabel,
}: AppliedFiltersTriggerProps) {
  return (
    <DasPopover>
      <DasPopover.Trigger
        className={cn(
          'text-xs text-[#1a1a1a] underline',
          disabled && 'pointer-events-none opacity-50'
        )}
      >
        {label}
      </DasPopover.Trigger>
      <DasPopover.Content
        align="right"
        className="z-[70] mt-1.5 w-[230px] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
      >
        {({ close }) => (
          <>
            <div className="flex h-8 items-center gap-2 border-b border-[#e5e5e5] bg-white px-3">
              <span className="flex-1 text-sm font-semibold leading-5 text-[#1a1a1a]">{title}</span>
              <Button
                type="button"
                variant="icon"
                size="icon"
                onClick={() => close()}
                aria-label={closeLabel}
                className="h-4 w-4"
              >
                <DasIcon name="x" size={12} />
              </Button>
            </div>
            <div className="flex max-h-[260px] flex-col gap-2 overflow-y-auto p-3">
              {entries.map((entry, idx) => (
                <div key={`${entry.label}-${idx}`} className="flex items-start gap-3">
                  <span className="flex-1 text-xs leading-[15px] text-[#808080]">
                    {entry.label}
                  </span>
                  <span className="text-right text-xs leading-[15px] text-[#1a1a1a] break-words">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </DasPopover.Content>
    </DasPopover>
  );
}
