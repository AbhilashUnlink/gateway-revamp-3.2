import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

interface DetailsHeaderProps {
  transactionRefId: string;
  lifecycleLabel: string;
  balanceLabel: string | null;
  onEditStatus: () => void;
  showEditStatus: boolean;
}

export function DetailsHeader({
  transactionRefId,
  lifecycleLabel,
  balanceLabel,
  onEditStatus,
  showEditStatus,
}: DetailsHeaderProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-6 pt-6">
      <div className="flex flex-1 flex-col gap-1.5 min-w-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/transactions')}
            className="text-[#1a1a1a] hover:opacity-70"
            aria-label={t('transaction_details_page.back')}
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold leading-7 text-[#1a1a1a]">
            {t('transaction_details_page.title')}
          </h1>
        </div>
        <div className="pl-9 text-xs leading-4 text-[#808080] truncate">
          <span>{t('transaction_details_page.breadcrumb_transactions')}</span>
          <span className="px-1">/</span>
          <span>{t('transaction_details_page.breadcrumb_ref_id', { id: transactionRefId })}</span>
        </div>
      </div>

      <div className="flex h-12 items-stretch gap-0 rounded-2xl border border-white bg-[#fff6e6] px-4 py-2.5 drop-shadow-[0px_4px_4.5px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col items-start justify-between px-3">
          <span className="whitespace-nowrap text-xs font-medium uppercase leading-5 text-[#f7941d]">
            {t('transaction_details_page.lifecycle_status')}
          </span>
          <span className="whitespace-nowrap text-xs font-semibold leading-5 text-[#1a1a1a]">
            {lifecycleLabel || '—'}
          </span>
        </div>
        {balanceLabel && (
          <>
            <div className="my-1 w-px bg-[#e5e5e5]" />
            <div className="flex flex-col items-start justify-between px-3">
              <span className="whitespace-nowrap text-xs font-medium uppercase leading-5 text-[#f7941d]">
                {t('transaction_details_page.balance_left')}
              </span>
              <span className="whitespace-nowrap text-xs font-semibold leading-5 text-[#1a1a1a]">
                {balanceLabel}
              </span>
            </div>
          </>
        )}
      </div>

      {showEditStatus && (
        <Button type="button" variant="ghost" onClick={onEditStatus} className="gap-2">
          <Pencil size={18} />
          {t('transaction_details_page.edit_status')}
        </Button>
      )}
    </div>
  );
}
