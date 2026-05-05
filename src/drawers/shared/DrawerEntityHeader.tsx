import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DasIcon } from '@/components/ui/DasIcon';
import { CopyButton } from '@/components/ui/CopyButton';
import { useDrawerControl } from '@/hooks/useDrawerControl';

interface DrawerEntityHeaderProps {
  label: string;
  value: string;
  copyable?: boolean;
}

export function DrawerEntityHeader({ label, value, copyable = true }: DrawerEntityHeaderProps) {
  const { t } = useTranslation();
  const { close } = useDrawerControl();
  const display = value || 'N/A';

  return (
    <div className="flex h-18 items-center rounded-tl-2xl rounded-tr-2xl border-l border-r border-t border-white bg-gradient-to-r from-brand-light to-brand-soft px-6 py-1.5">
      <div className="flex flex-1 items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-normal leading-5 text-[#1a1a1a]">{label}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold leading-5 text-[#1a1a1a]">{display}</span>
            {copyable && value && (
              <CopyButton
                value={value}
                size={16}
                ariaLabel={t('drawer.copy')}
                className="flex h-8 w-8 items-center justify-center"
              />
            )}
          </div>
        </div>
        <Button
          variant="icon"
          size="icon"
          type="button"
          onClick={close}
          aria-label={t('drawer.close')}
        >
          <DasIcon name="x-circle" size={24} />
        </Button>
      </div>
    </div>
  );
}
