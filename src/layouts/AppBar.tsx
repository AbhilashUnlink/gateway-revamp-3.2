import { useAppSelector } from '@/store/hooks';
import { DasIcon } from '@/components/ui/das-icon';
import poLogo from '@/assets/payment-options.svg';
import { cn } from '@/utils/cn';
import { UserProfilePopover } from '@/components/ui/user-profile-popover';
import LanguageSelect from '@/components/language-select/language-select';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

// ── Divider section wrapper ───────────────────────────────────────────────

function BarSection({
  children,
  divider = true,
  className,
}: {
  children: React.ReactNode;
  divider?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex h-11 items-center',
        divider && 'border-r border-[#e5e5e5] pr-3',
        className
      )}
    >
      {children}
    </div>
  );
}

// ── AppBar ────────────────────────────────────────────────────────────────

export function AppBar() {
  const timezone = useAppSelector((s) => s.settings.timezone || 'UTC+05:30');
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-[#e5e5e5] bg-white pl-4.5 pr-6">
      {/* ── Logo ── */}
      <img src={poLogo} alt="Payment Options" className="h-12 w-auto" />

      {/* ── CTAs ── */}
      <div className="flex items-center gap-3 py-3">
        {/* Timezone */}
        <BarSection>
          <Button type="button" variant="icon" size="inline" className="gap-2.5">
            <DasIcon name="globe" size={24} className="shrink-0 text-[#1a1a1a]" />
            <span className="text-xs font-medium capitalize whitespace-nowrap">{timezone}</span>
            <DasIcon name="chevron-down" size={12} className="shrink-0" />
          </Button>
        </BarSection>

        {/* Theme toggle */}
        <BarSection>
          <Button
            type="button"
            variant="icon"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={cn(
              'size-6 rounded-full',
              theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#d3caba]'
            )}
          >
            {theme === 'dark' ? (
              <DasIcon name="moon" size={16} className="text-white" />
            ) : (
              <DasIcon name="sun" size={16} className="text-[#1a1a1a]" />
            )}
          </Button>
        </BarSection>

        {/* Language */}
        <BarSection>
          <LanguageSelect />
        </BarSection>

        {/* Notifications */}
        <BarSection>
          <div className="relative">
            <Button type="button" variant={'link'} aria-label="Notifications">
              <DasIcon name="bell" size={24} className="text-[#1a1a1a]" />
            </Button>
            <span className="absolute top-2 right-4 flex size-2 rounded-full bg-[#f7941d]" />
          </div>
        </BarSection>

        {/* User profile */}
        <BarSection divider={false}>
          <UserProfilePopover />
        </BarSection>
      </div>
    </header>
  );
}
