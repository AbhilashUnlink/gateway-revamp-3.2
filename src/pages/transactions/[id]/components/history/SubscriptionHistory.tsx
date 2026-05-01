import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { CopyButton } from '@/components/ui/CopyButton';
import type { TransactionHistoryItem } from '@/types/transactions/transactionDetails.types';
import { FieldCell, HistoryCard, StatusBadge } from '../primitives';
import { formatDateTime12, isSuccessStatus, shortenId } from '../../utils';

interface SubscriptionCycleCardProps {
  item: TransactionHistoryItem;
  cycleNumber: number;
  isActive: boolean;
}

const SubscriptionCycleCard = memo(function SubscriptionCycleCard({
  item,
  cycleNumber,
  isActive,
}: SubscriptionCycleCardProps) {
  const { t } = useTranslation();
  const refId = item.trackid ?? item.uuid;
  const success = isSuccessStatus(item.status);

  return (
    <HistoryCard.Root active={isActive}>
      <HistoryCard.Header active={isActive}>
        <StatusBadge
          label={t('transaction_details_page.cycle_billed_label', { cycle: cycleNumber })}
          tone="neutral"
        />
      </HistoryCard.Header>
      <HistoryCard.Body active={isActive}>
        <HistoryCard.Grid>
          <FieldCell label={t('transaction_details_page.transaction_ref_id')}>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'truncate text-sm font-semibold leading-5 underline',
                  isActive ? 'text-[#f7941d]' : 'text-[#1a1a1a]'
                )}
              >
                {shortenId(refId)}
              </span>
              <CopyButton value={refId} ariaLabel={t('drawer.copy')} />
            </div>
          </FieldCell>

          <FieldCell align="end" label={t('transaction_details_page.amount')}>
            {`${item.CurrencyCode} ${item.amount}`}
          </FieldCell>

          <FieldCell label={t('transaction_details_page.transaction_date')}>
            {formatDateTime12(item.CreatedAt)}
          </FieldCell>

          <FieldCell align="end" label={t('transaction_details_page.update_date')}>
            {formatDateTime12(item.CreatedAt)}
          </FieldCell>

          <FieldCell label={t('transaction_details_page.status')}>
            <StatusBadge label={item.status || '—'} tone={success ? 'success' : 'error'} />
          </FieldCell>
        </HistoryCard.Grid>
      </HistoryCard.Body>
    </HistoryCard.Root>
  );
});

interface SubscriptionHistoryProps {
  items: TransactionHistoryItem[];
  startingCycle?: number;
}

export function SubscriptionHistory({ items, startingCycle }: SubscriptionHistoryProps) {
  const { t } = useTranslation();

  const recurring = useMemo(
    () =>
      items
        .filter((i) => i.Isrecurring)
        .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime()),
    [items]
  );

  if (recurring.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#808080]">
        {t('transaction_details_page.subscription_history_empty')}
      </div>
    );
  }

  const baseCycle = Number.isFinite(startingCycle) ? (startingCycle as number) : recurring.length;

  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      {recurring.map((item, idx) => (
        <SubscriptionCycleCard
          key={`${item.uuid}-${idx}`}
          item={item}
          cycleNumber={baseCycle - idx}
          isActive={idx === 0}
        />
      ))}
    </div>
  );
}
