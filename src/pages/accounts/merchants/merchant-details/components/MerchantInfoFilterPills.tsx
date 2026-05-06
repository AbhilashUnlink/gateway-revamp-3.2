import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { Button } from '@/components/ui/button';
import { MERCHANT_INFO_PILLS, type MerchantInfoFilter } from '../merchantDetailsConfig';

interface MerchantInfoFilterPillsProps {
  active: MerchantInfoFilter;
  onChange: (next: MerchantInfoFilter) => void;
}

export function MerchantInfoFilterPills({ active, onChange }: MerchantInfoFilterPillsProps) {
  const { t } = useTranslation();

  return (
    <div className="flex h-19 items-center gap-3 rounded-tl-2xl rounded-tr-2xl bg-[#fff6e6] px-6 py-1.5">
      {MERCHANT_INFO_PILLS.map((pill) => {
        const selected = pill.value === active;
        return (
          <Button
            key={pill.value}
            type="button"
            variant={selected ? 'primary' : 'chip'}
            onClick={() => onChange(pill.value)}
            className={cn(
              'h-7 w-auto px-4 text-sm leading-5 normal-case font-normal',
              selected
                ? 'rounded-2xl bg-[#f7941d] text-white drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.06)] hover:bg-[#f7941d]'
                : 'rounded-full border-[#1a1a1a] hover:bg-white/60'
            )}
          >
            {t(pill.labelKey)}
          </Button>
        );
      })}
    </div>
  );
}
