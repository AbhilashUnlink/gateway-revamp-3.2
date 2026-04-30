import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { CopyButton } from '@/components/ui/CopyButton';
import type { TransactionHistoryItem } from '@/types/transactions/transactionDetails.types';

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

interface SubscriptionCycleCardProps {
  item: TransactionHistoryItem;
  cycleNumber: number;
  isActive: boolean;
}

function SubscriptionCycleCard({ item, cycleNumber, isActive }: SubscriptionCycleCardProps) {
  const { t } = useTranslation();
  const refId = item.trackid ?? item.uuid;

  const status = (item.status ?? '').toUpperCase();
  const isSuccess = /SUCCESS|APPROVED|CAPTURED|PURCHASED?/.test(status);

  return (
    <div className="flex w-[453px] shrink-0 flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-block rounded-full',
            isActive ? 'h-3.5 w-3.5 bg-[#f7941d]' : 'h-2 w-2 bg-[#d0d0d0]'
          )}
        />
        <span className="inline-flex items-center rounded border border-[#e5e5e5] px-1 py-0.5 text-xs font-medium uppercase leading-none text-[#1a1a1a]">
          {t('transaction_details_page.cycle_billed_label', { cycle: cycleNumber })}
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
                {shortenId(refId)}
              </span>
              <CopyButton value={refId} ariaLabel={t('drawer.copy')} />
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.amount')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">
              {item.CurrencyCode} {item.amount}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.transaction_date')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">{format12Hour(item.CreatedAt)}</span>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.update_date')}
            </span>
            <span className="text-sm leading-5 text-[#1a1a1a]">{format12Hour(item.CreatedAt)}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm leading-5 text-[#808080]">
              {t('transaction_details_page.status')}
            </span>
            <span
              className={cn(
                'inline-flex w-fit items-center rounded px-1 py-0.5 text-xs font-medium uppercase leading-none',
                isSuccess ? 'bg-[#c6f3da] text-[#1e8f1f]' : 'bg-[#ffe2e2] text-[#ff4343]'
              )}
            >
              {item.status || '—'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface SubscriptionHistoryProps {
  items: TransactionHistoryItem[];
  startingCycle?: number;
}

export function SubscriptionHistory({ items, startingCycle }: SubscriptionHistoryProps) {
  const { t } = useTranslation();

  const recurring = items
    .filter((i) => i.Isrecurring)
    .sort((a, b) => new Date(b.CreatedAt).getTime() - new Date(a.CreatedAt).getTime());

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
