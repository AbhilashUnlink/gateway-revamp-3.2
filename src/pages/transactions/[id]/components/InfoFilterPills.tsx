import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { InfoSectionId } from '../utils/buildSections';

export type InfoFilter = 'all' | InfoSectionId;

interface PillConfig {
  value: InfoFilter;
  labelKey: string;
}

const PILLS: PillConfig[] = [
  { value: 'all', labelKey: 'transaction_details_page.filter_all' },
  { value: 'transaction', labelKey: 'transaction_details_page.section_transaction_info' },
  { value: 'merchant', labelKey: 'transaction_details_page.section_merchant_info' },
  { value: 'payment', labelKey: 'transaction_details_page.section_payment_card_info' },
  { value: 'subscription', labelKey: 'transaction_details_page.section_subscription_info' },
  { value: 'browser', labelKey: 'transaction_details_page.section_browser_info' },
  { value: 'additional', labelKey: 'transaction_details_page.section_additional_info' },
];

interface InfoFilterPillsProps {
  active: InfoFilter;
  onChange: (next: InfoFilter) => void;
}

export function InfoFilterPills({ active, onChange }: InfoFilterPillsProps) {
  const { t } = useTranslation();
  return (
    <div className="flex h-19 items-center gap-3 rounded-tl-2xl rounded-tr-2xl bg-[#fff6e6] px-6 py-1.5">
      {PILLS.map((pill) => {
        const selected = pill.value === active;
        return (
          <button
            key={pill.value}
            type="button"
            onClick={() => onChange(pill.value)}
            className={cn(
              'inline-flex h-7 items-center px-4 text-sm leading-5 transition-colors',
              selected
                ? 'rounded-2xl bg-[#f7941d] text-white drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.06)]'
                : 'rounded-full border border-[#1a1a1a] text-[#1a1a1a] hover:bg-white/60'
            )}
          >
            {t(pill.labelKey)}
          </button>
        );
      })}
    </div>
  );
}
