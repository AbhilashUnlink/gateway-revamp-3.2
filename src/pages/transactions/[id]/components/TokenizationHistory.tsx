import { Copy } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function format12Hour(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const dd = d.getDate().toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  const hours24 = d.getHours();
  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hh = (hours24 % 12 || 12).toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');
  return `${dd} ${MONTHS[d.getMonth()]} ${yyyy} | ${hh}:${mm}:${ss} ${ampm}`;
}

function shortenId(id: string): string {
  if (!id) return '—';
  if (id.length <= 18) return id;
  return `${id.slice(0, 9)}....${id.slice(-7)}`;
}

interface TokenizedItem {
  uuid?: string;
  trackid?: string | null;
  TransactionRefID?: string;
  amount?: number | string;
  CurrencyCode?: string;
  status?: string;
  Status?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  [key: string]: unknown;
}

interface TokenCardProps {
  item: TokenizedItem;
  isActive: boolean;
}

function TokenCard({ item, isActive }: TokenCardProps) {
  const { t } = useTranslation();

  const refId = item.TransactionRefID ?? item.trackid ?? item.uuid ?? '';
  const status = (item.Status ?? item.status ?? '').toString();
  const statusUpper = status.toUpperCase();
  const isSuccess = /SUCCESS|APPROVED|CAPTURED|PURCHASED?/.test(statusUpper);
  const createdAt = item.CreatedAt ?? '';
  const updatedAt = item.UpdatedAt ?? item.CreatedAt ?? '';

  const handleCopy = () => void navigator.clipboard.writeText(String(refId));

  return (
    <div className="flex w-[453px] shrink-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-block rounded-full',
            isActive ? 'h-3.5 w-3.5 bg-[#f7941d]' : 'h-2 w-2 bg-[#d0d0d0]'
          )}
        />
        <span
          className={cn(
            'inline-flex items-center rounded px-1 py-0.5 text-xs font-medium uppercase leading-none',
            isSuccess ? 'bg-[#c6f3da] text-[#1e8f1f]' : 'bg-[#ffe2e2] text-[#ff4343]'
          )}
        >
          {status || '—'}
        </span>
      </div>

      <div
        className={cn(
          'flex flex-col overflow-hidden rounded-2xl border',
          isActive ? 'border-[#f7941d] bg-[#fff6e6]' : 'border-[#e5e5e5] bg-white'
        )}
      >
        <div className="grid grid-cols-2 gap-x-3 gap-y-3 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.transaction_ref_id')}
            </span>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'truncate text-sm font-semibold leading-5 underline',
                  isActive ? 'text-[#f7941d]' : 'text-[#1a1a1a]'
                )}
              >
                {shortenId(String(refId))}
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
              {t('transaction_details_page.amount')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">
              {item.CurrencyCode ?? ''} {item.amount ?? ''}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.transaction_date')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">{format12Hour(createdAt)}</span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.update_date')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">{format12Hour(updatedAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TokenizationHistoryProps {
  items: unknown[];
}

export function TokenizationHistory({ items }: TokenizationHistoryProps) {
  const { t } = useTranslation();

  const list = (Array.isArray(items) ? (items as TokenizedItem[]) : []).slice().sort((a, b) => {
    const aTime = new Date(a.CreatedAt ?? 0).getTime();
    const bTime = new Date(b.CreatedAt ?? 0).getTime();
    return bTime - aTime;
  });

  if (list.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[#808080]">
        {t('transaction_details_page.tokenization_history_empty')}
      </div>
    );
  }

  return (
    <div className="flex gap-6 overflow-x-auto pb-2">
      {list?.map((item, idx) => (
        <TokenCard
          key={`${item.uuid ?? item.trackid ?? idx}-${idx}`}
          item={item}
          isActive={idx === 0}
        />
      ))}
    </div>
  );
}
