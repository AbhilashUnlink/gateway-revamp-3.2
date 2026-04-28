import { ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSettings } from '@/store/slices/settingsSlice';
import DasPopover from '@/components/ui/DasPopover';
import { FlagGB, FlagJP } from './flags';
import { cn } from '@/utils/cn';

// ── Config ────────────────────────────────────────────────────────────────

type LangCode = 'en' | 'jp';

const LANGUAGES: {
  code: LangCode;
  label: string;
  triggerLabel: string;
  Flag: React.ComponentType<{ className?: string }>;
}[] = [
  { code: 'en', label: 'EN', triggerLabel: 'English (UK)', Flag: FlagGB },
  { code: 'jp', label: '日本', triggerLabel: '日本語', Flag: FlagJP },
];

// ── Component ─────────────────────────────────────────────────────────────

type Variant = 'dark' | 'light';

function LanguageSelect({ variant = 'dark' }: { variant?: Variant }) {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const currentLang = (useAppSelector((s) => s.settings.language) || 'en') as LangCode;

  const current = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  const handleSelect = (code: LangCode) => {
    dispatch(updateSettings({ language: code }));
    void i18n.changeLanguage(code);
  };

  return (
    <DasPopover>
      <DasPopover.Trigger
        className={cn(
          'flex items-center gap-2.5 transition-opacity hover:opacity-70',
          variant === 'light' ? 'text-white' : 'text-[#1a1a1a]'
        )}
      >
        <span className="text-xs font-medium whitespace-nowrap ">{current?.triggerLabel}</span>
        <ChevronDown size={12} className="shrink-0" />
      </DasPopover.Trigger>

      <DasPopover.Content align="right" className="w-36 p-0">
        {LANGUAGES.map(({ code, label, Flag }) => {
          const isSelected = currentLang === code;
          return (
            <button
              key={code}
              type="button"
              onClick={() => handleSelect(code)}
              className={cn(
                'flex w-full items-center gap-2 p-3',
                'border-b border-[#e5e5e5] last:border-b-0',
                'text-sm text-[#1a1a1a] transition-colors hover:bg-[#fff6e6]',
                isSelected && 'bg-[#fff6e6]'
              )}
            >
              <Flag className="h-4 w-6 shrink-0" />
              <span>{label}</span>
            </button>
          );
        })}
      </DasPopover.Content>
    </DasPopover>
  );
}

export default LanguageSelect;
