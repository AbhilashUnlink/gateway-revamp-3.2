import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/ui/copy-button';
import type { ChargebackCase } from '@/types/transactions/chargeback.types';
import { FieldCell, HistoryCard, HistoryState, StatusBadge } from '../primitives';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';
import { shortenId } from '@/utils/shortenId';

interface ChargebackHistoryProps {
  cases: ChargebackCase[];
  loading: boolean;
  error: string | null;
}

export function ChargebackHistory({ cases, loading, error }: ChargebackHistoryProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <HistoryState variant="loading">
        {t('transaction_details_page.chargeback_loading')}
      </HistoryState>
    );
  }

  if (error) {
    return <HistoryState variant="error">{error}</HistoryState>;
  }

  if (cases.length === 0) {
    return (
      <HistoryState variant="empty">{t('transaction_details_page.chargeback_empty')}</HistoryState>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      {cases.map((c) => (
        <ChargebackCard key={`${c.stageKey}-${c.caseId}`} data={c} />
      ))}
    </div>
  );
}

interface ChargebackCardProps {
  data: ChargebackCase;
}

const ChargebackCard = memo(function ChargebackCard({ data }: ChargebackCardProps) {
  const { t } = useTranslation();
  const formatDate = useUserDateFormat();

  return (
    <HistoryCard.Root>
      <HistoryCard.Header>
        <StatusBadge label={data.stageLabel} tone="neutral" />
      </HistoryCard.Header>
      <HistoryCard.Body>
        <HistoryCard.Grid>
          <FieldCell label={t('transaction_details_page.case_id')}>
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold leading-5 text-[#1a1a1a] underline">
                {shortenId(data.caseId)}
              </span>
              <CopyButton value={data.caseId} ariaLabel={t('drawer.copy')} />
            </div>
          </FieldCell>

          <FieldCell align="end" label={t('transaction_details_page.dispute_amount')}>
            {`${data.currency} ${data.amount}`}
          </FieldCell>

          <FieldCell label={t('transaction_details_page.issued_date')}>
            {formatDate(data.issuedAt) || 'N/A'}
          </FieldCell>

          <FieldCell align="end" label={t('transaction_details_page.due_date')}>
            N/A
          </FieldCell>

          <FieldCell label={t('transaction_details_page.arn')}>{data.arn ?? 'N/A'}</FieldCell>

          <FieldCell align="end" label={t('transaction_details_page.status')}>
            <StatusBadge
              label={data.statusLabel}
              tone={data.statusTone === 'open' ? 'success' : 'error'}
            />
          </FieldCell>
        </HistoryCard.Grid>

        <HistoryCard.Footer>
          <span className="text-sm leading-5 text-[#808080]">
            {t('transaction_details_page.reason_description')}
          </span>
          <span className="line-clamp-2 text-sm leading-5 text-[#1a1a1a]">
            {data.reasonDescription ?? 'N/A'}
          </span>
        </HistoryCard.Footer>
      </HistoryCard.Body>
    </HistoryCard.Root>
  );
});
