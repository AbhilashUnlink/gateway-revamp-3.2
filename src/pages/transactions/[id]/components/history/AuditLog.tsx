import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FieldCell, HistoryCard, StatusBadge } from '../primitives';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';
import { isSuccessStatus } from '@/pages/transactions/[id]/utils/status';
import type { AuditEntry } from '../../types';

const getUpdatedAt = (e: AuditEntry) => e.UpdatedAt ?? e.updatedAt ?? e.CreatedAt ?? '';

interface AuditCardProps {
  entry: AuditEntry;
}

const AuditCard = memo(function AuditCard({ entry }: AuditCardProps) {
  const { t } = useTranslation();
  const formatDate = useUserDateFormat();

  const updatedBy = entry.UpdatedBy ?? entry.updatedBy ?? entry.CreatedBy ?? 'N/A';
  const updateDate = getUpdatedAt(entry);
  const authCode = entry.AuthCode ?? entry.authCode ?? 'N/A';
  const description = entry.Description ?? entry.description ?? entry.Comment ?? 'N/A';
  const status = (entry.Status ?? entry.status ?? 'Successful').toString();

  return (
    <HistoryCard.Root>
      <HistoryCard.Header>
        <StatusBadge label={status} tone={isSuccessStatus(status) ? 'success' : 'error'} />
      </HistoryCard.Header>
      <HistoryCard.Body>
        <HistoryCard.Grid>
          <FieldCell label={t('transaction_details_page.updated_by')}>{updatedBy}</FieldCell>
          <FieldCell align="end" label={t('transaction_details_page.update_date')}>
            {updateDate ? formatDate(updateDate) : 'N/A'}
          </FieldCell>
          <FieldCell label={t('transaction_details_page.auth_code')}>{authCode}</FieldCell>
        </HistoryCard.Grid>
        <HistoryCard.Footer>
          <span className="text-sm leading-5 text-[#808080]">
            {t('transaction_details_page.description')}
          </span>
          <span className="line-clamp-2 text-sm leading-5 text-[#1a1a1a]">{description}</span>
        </HistoryCard.Footer>
      </HistoryCard.Body>
    </HistoryCard.Root>
  );
});

interface AuditLogProps {
  items: unknown[];
}

export function AuditLog({ items }: AuditLogProps) {
  const { t } = useTranslation();

  const list = useMemo(() => {
    const arr = Array.isArray(items) ? (items as AuditEntry[]) : [];
    return arr
      .slice()
      .sort((a, b) => new Date(getUpdatedAt(b)).getTime() - new Date(getUpdatedAt(a)).getTime());
  }, [items]);

  if (list.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#808080]">
        {t('transaction_details_page.audit_log_empty')}
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      {list.map((entry, idx) => (
        <AuditCard key={idx} entry={entry} />
      ))}
    </div>
  );
}
