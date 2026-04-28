import { Copy, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { ChargebackCase } from '@/types/transactions/chargeback.types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const dd = d.getDate().toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');
  return `${dd} ${MONTHS[d.getMonth()]} ${yyyy} | ${hh}:${mm}:${ss}`;
}

function formatDate(iso: string | null): string {
  if (!iso) return 'N/A';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const dd = d.getDate().toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd} ${MONTHS[d.getMonth()]} ${yyyy}`;
}

function shortenId(id: string): string {
  if (id.length <= 16) return id;
  return `${id.slice(0, 7)}...${id.slice(-8)}`;
}

interface ChargebackCardProps {
  data: ChargebackCase;
}

function ChargebackCard({ data }: ChargebackCardProps) {
  const { t } = useTranslation();

  const handleCopy = () => void navigator.clipboard.writeText(data.caseId);

  return (
    <div className="flex w-[453px] shrink-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-[#d0d0d0]" />
        <span className="inline-flex items-center rounded border border-[#e5e5e5] px-1 py-0.5 text-xs font-medium uppercase leading-none text-[#1a1a1a]">
          {data.stageLabel}
        </span>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white">
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.case_id')}
            </span>
            <div className="flex items-center gap-2">
              <span className="truncate text-sm font-semibold leading-5 text-[#1a1a1a] underline">
                {shortenId(data.caseId)}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 text-[#808080] hover:text-[#1a1a1a]"
                aria-label={t('drawer.copy')}
              >
                <Copy size={14} />
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.dispute_amount')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">
              {data.currency} {data.amount}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.issued_date')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">
              {formatDateTime(data.issuedAt)}
            </span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.due_date')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">{formatDate(null)}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.arn')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">{data.arn ?? 'N/A'}</span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.status')}
            </span>
            <span
              className={cn(
                'inline-flex items-center rounded px-1 py-0.5 text-xs font-medium uppercase leading-none',
                data.statusTone === 'open'
                  ? 'bg-[#c6f3da] text-[#1e8f1f]'
                  : 'bg-[#ffe2e2] text-[#ff4343]'
              )}
            >
              {data.statusLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 bg-[#fafafa] p-4">
          <span className="text-sm leading-5 text-[#808080]">
            {t('transaction_details_page.reason_description')}
          </span>
          <span className="line-clamp-2 text-sm leading-5 text-[#1a1a1a]">
            {data.reasonDescription ?? 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}

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
