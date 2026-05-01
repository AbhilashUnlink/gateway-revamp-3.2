import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CopyButton } from '@/components/ui/CopyButton';
import type { ChargebackCase } from '@/types/transactions/chargeback.types';
import { FieldCell, HistoryCard, StatusBadge } from '../primitives';
import { formatDateOnly, formatDateTime24, shortenCaseId } from '../../utils';

interface ChargebackCardProps {
  data: ChargebackCase;
}

const ChargebackCard = memo(function ChargebackCard({ data }: ChargebackCardProps) {
  const { t } = useTranslation();

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
                {shortenCaseId(data.caseId)}
              </span>
              <CopyButton value={data.caseId} ariaLabel={t('drawer.copy')} />
            </div>
          </FieldCell>

          <FieldCell align="end" label={t('transaction_details_page.dispute_amount')}>
            {`${data.currency} ${data.amount}`}
          </FieldCell>

          <FieldCell label={t('transaction_details_page.issued_date')}>
            {formatDateTime24(data.issuedAt)}
          </FieldCell>

          <FieldCell align="end" label={t('transaction_details_page.due_date')}>
            {formatDateOnly(null)}
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

interface ChargebackHistoryProps {
  cases: ChargebackCase[];
  loading: boolean;
  error: string | null;
}

export function ChargebackHistory({ cases, loading, error }: ChargebackHistoryProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#808080]">
        <Loader2 size={16} className="animate-spin" />
        {t('transaction_details_page.chargeback_loading')}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#ff4343]">{error}</div>
    );
  }

  if (cases.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#808080]">
        {t('transaction_details_page.chargeback_empty')}
      </div>
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
