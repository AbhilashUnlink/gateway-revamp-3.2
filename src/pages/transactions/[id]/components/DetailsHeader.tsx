import { useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { BackButtonIcon, EditButtonIcon } from '@/assets/icons/action-buttons';

interface LifecyclePillProps {
  label: string;
  value: string;
}

function LifecyclePill({ label, value }: LifecyclePillProps) {
  return (
    <div className="flex flex-col items-start justify-between -mt-1 px-3">
      <span className="whitespace-nowrap text-xs font-medium uppercase leading-5 text-[#f7941d]">
        {label}
      </span>
      <span className="-mt-0.5 whitespace-nowrap text-xs font-semibold leading-5 text-[#1a1a1a]">
        {value}
      </span>
    </div>
  );
}

interface LifecycleSummaryBadgeProps {
  lifecycleLabel: string;
  balanceLabel: string | null;
}

function LifecycleSummaryBadge({ lifecycleLabel, balanceLabel }: LifecycleSummaryBadgeProps) {
  const { t } = useTranslation();
  return (
    <div className="flex h-12 items-stretch gap-0 rounded-2xl border border-white bg-[#fff6e6] px-4 py-2.5 drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]">
      <LifecyclePill
        label={t('transaction_details_page.lifecycle_status')}
        value={lifecycleLabel || '—'}
      />
      {balanceLabel && (
        <>
          <div className="my-1 w-px bg-[#e5e5e5]" />
          <LifecyclePill label={t('transaction_details_page.balance_left')} value={balanceLabel} />
        </>
      )}
    </div>
  );
}

interface DetailsHeaderProps {
  transactionRefId: string;
  lifecycleLabel: string;
  balanceLabel: string | null;
  onEditStatus: () => void;
  showEditStatus: boolean;
  rightSlot?: ReactNode;
}

export function DetailsHeader({
  transactionRefId,
  lifecycleLabel,
  balanceLabel,
  onEditStatus,
  showEditStatus,
  rightSlot,
}: DetailsHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const goBack = useCallback(() => navigate('/transactions'), [navigate]);

  return (
    <div className="flex items-center gap-6 pt-6">
      <div className="flex min-w-0 flex-1 flex-col gap-1.5">
        <div className="flex items-center gap-3">
          <Button
            onClick={goBack}
            variant="icon"
            size="icon"
            aria-label={t('transaction_details_page.back')}
          >
            <BackButtonIcon />
          </Button>
          <h1 className="text-xl font-semibold leading-7 text-[#1a1a1a]">
            {t('transaction_details_page.title')}
          </h1>
        </div>
        <div className="truncate pl-9 text-xs leading-4 text-[#808080]">
          <span>{t('transaction_details_page.breadcrumb_transactions')}</span>
          <span className="px-1">/</span>
          <span>{t('transaction_details_page.breadcrumb_ref_id', { id: transactionRefId })}</span>
        </div>
      </div>

      <LifecycleSummaryBadge lifecycleLabel={lifecycleLabel} balanceLabel={balanceLabel} />

      {showEditStatus && (
        <Button type="button" variant="ghost" onClick={onEditStatus} className="gap-2">
          <EditButtonIcon />
          {t('transaction_details_page.edit_status')}
        </Button>
      )}

      {rightSlot}
    </div>
  );
}
