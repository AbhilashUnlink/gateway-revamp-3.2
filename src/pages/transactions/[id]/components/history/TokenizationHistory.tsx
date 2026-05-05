import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { CopyButton } from '@/components/ui/copy-button';
import { FieldCell, HistoryCard, HistoryState, StatusBadge } from '../primitives';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';
import { shortenId } from '@/utils/shortenId';
import { isSuccessStatus } from '@/pages/transactions/[id]/utils/status';
import type { TokenizedItem } from '../../types';

interface TokenCardProps {
  item: TokenizedItem;
  isActive: boolean;
}

const TokenCard = memo(function TokenCard({ item, isActive }: TokenCardProps) {
  const { t } = useTranslation();
  const formatDate = useUserDateFormat();

  const refId = String(item.TransactionRefID ?? item.trackid ?? item.uuid ?? '');
  const status = (item.Status ?? item.status ?? '').toString();
  const success = isSuccessStatus(status);
  const createdAt = item.CreatedAt ?? '';
  const updatedAt = item.UpdatedAt ?? item.CreatedAt ?? '';

  return (
    <HistoryCard.Root active={isActive}>
      <HistoryCard.Header active={isActive}>
        <StatusBadge label={status || '—'} tone={success ? 'success' : 'error'} />
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
            {`${item.CurrencyCode ?? ''} ${item.amount ?? ''}`}
          </FieldCell>

          <FieldCell label={t('transaction_details_page.transaction_date')}>
            {formatDate(createdAt)}
          </FieldCell>

          <FieldCell align="end" label={t('transaction_details_page.update_date')}>
            {formatDate(updatedAt)}
          </FieldCell>
        </HistoryCard.Grid>
      </HistoryCard.Body>
    </HistoryCard.Root>
  );
});

interface TokenizationHistoryProps {
  items: unknown[];
  activeUuid?: string;
}

export function TokenizationHistory({ items, activeUuid }: TokenizationHistoryProps) {
  const { t } = useTranslation();

  const list = useMemo(() => {
    const arr = Array.isArray(items) ? (items as TokenizedItem[]) : [];
    return arr
      .slice()
      .sort((a, b) => new Date(b.CreatedAt ?? 0).getTime() - new Date(a.CreatedAt ?? 0).getTime());
  }, [items]);

  if (list.length === 0) {
    return (
      <HistoryState variant="empty">
        {t('transaction_details_page.tokenization_history_empty')}
      </HistoryState>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      {list.map((item, idx) => (
        <TokenCard
          key={`${item.uuid ?? item.trackid ?? idx}-${idx}`}
          item={item}
          isActive={activeUuid ? item.uuid === activeUuid : idx === 0}
        />
      ))}
    </div>
  );
}
