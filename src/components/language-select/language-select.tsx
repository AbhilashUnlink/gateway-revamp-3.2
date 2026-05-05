import { useTranslation } from 'react-i18next';
import { DasIcon } from '@/components/ui/das-icon';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateSettings } from '@/store/slices/settingsSlice';
import DasPopover from '@/components/ui/das-popover';
import { Button } from '@/components/ui/button';
import { FlagGB, FlagJP } from './flags';
import { cn } from '@/utils/cn';

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

type Variant = 'dark' | 'light';

function LanguageSelect({ variant = 'dark' }: { variant?: Variant }) {
  const dispatch = useAppDispatch();
  const { i18n } = useTranslation();
  const currentLang = (useAppSelector((s) => s.settings.language) || 'en') as LangCode;

  const current = LANGUAGES.find((l) => l.code === currentLang) ?? LANGUAGES[0];

  const handleSelect = (code: LangCode, close: () => void) => {
    dispatch(updateSettings({ language: code }));
    void i18n.changeLanguage(code);
    close();
  };

  return (
    <DasPopover>
      <DasPopover.Trigger
        className={cn(
          'flex items-center gap-2.5 transition-opacity hover:opacity-70',
          variant === 'light' ? 'text-white' : 'text-[#1a1a1a]'
        )}
      >
        <span className="whitespace-nowrap text-xs font-medium">{current?.triggerLabel}</span>
        <DasIcon name="chevron-down" size={12} className="shrink-0" />
      </DasPopover.Trigger>

      <DasPopover.Content align="right" className="w-36 p-0">
        {({ close }) => (
          <>
            {LANGUAGES.map(({ code, label, Flag }) => (
              <Button
                key={code}
                type="button"
                variant="language-option"
                size="menu-item"
                data-selected={currentLang === code}
                onClick={() => handleSelect(code, close)}
              >
                <Flag className="h-4 w-6 shrink-0" />
                <span>{label}</span>
              </Button>
            ))}
          </>
        )}
      </DasPopover.Content>
    </DasPopover>
  );
}

export default LanguageSelect;
