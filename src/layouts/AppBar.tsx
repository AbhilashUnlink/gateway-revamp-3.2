import { Globe, Sun, Moon, Bell, ChevronDown } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import poLogo from '@/assets/payment-options.svg';
import { cn } from '@/utils/cn';
import { UserProfilePopover } from '@/components/ui/UserProfilePopover';
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
          <button
            type="button"
            className="flex items-center gap-2.5 text-[#1a1a1a] transition-opacity hover:opacity-70"
          >
            <Globe size={24} className="shrink-0 text-[#1a1a1a]" />
            <span className="text-xs font-medium capitalize whitespace-nowrap">{timezone}</span>
            <ChevronDown size={12} className="shrink-0" />
          </button>
        </BarSection>

        {/* Theme toggle */}
        <BarSection>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={cn(
              'flex size-6 items-center justify-center rounded-full transition-opacity hover:opacity-70',
              theme === 'dark' ? 'bg-[#1a1a1a]' : 'bg-[#d3caba]'
            )}
          >
            {theme === 'dark' ? (
              <Moon size={16} className="text-white" />
            ) : (
              <Sun size={16} className="text-[#1a1a1a]" />
            )}
          </button>
        </BarSection>

        {/* Language */}
        <BarSection>
          <LanguageSelect />
        </BarSection>

        {/* Notifications */}
        <BarSection>
          <div className="relative">
            <Button type="button" variant={'link'} aria-label="Notifications">
              <Bell size={24} className="text-[#1a1a1a]" />
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
