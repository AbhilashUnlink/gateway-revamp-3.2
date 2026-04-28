import { cn } from '@/utils/cn';
import type { TransactionHistoryItem } from '@/types/transactions/transactionDetails.types';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const dd = d.getDate().toString().padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd} ${MONTHS[d.getMonth()]} ${yyyy}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

interface EventCardProps {
  item: TransactionHistoryItem;
  isFirst: boolean;
}

function EventCard({ item, isFirst }: EventCardProps) {
  const label = (item.event ?? '').toUpperCase();
  return (
    <div className="flex min-w-[252px] flex-1 flex-col gap-2">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'inline-block rounded-full',
            isFirst ? 'h-3.5 w-3.5 bg-[#f7941d]' : 'h-2 w-2 bg-[#d0d0d0]'
          )}
        />
        <span
          className={cn(
            'text-xs font-medium uppercase leading-none',
            isFirst ? 'text-[#f7941d]' : 'text-[#808080]'
          )}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3 pl-3">
        <span className="text-sm font-semibold leading-5 text-[#1a1a1a]">
          {item.CurrencyCode} {item.amount?.toFixed?.(2) ?? item.amount}
        </span>
        <span className="text-sm leading-5 text-[#1a1a1a]">
          {formatDate(item.CreatedAt)}{' '}
          <span className="text-[#808080]">| {formatTime(item.CreatedAt)}</span>
        </span>
      </div>
    </div>
  );
}

interface LifecycleTimelineProps {
  items: TransactionHistoryItem[];
}

export function LifecycleTimeline({ items }: LifecycleTimelineProps) {
  if (!items?.length) return null;

  return (
    <div className="relative flex items-start gap-6 px-6 py-6">
      <div className="absolute left-9 right-9 top-[14px] -z-0 border-t border-dashed border-[#d0d0d0]" />
      {items.map((item, idx) => (
        <EventCard key={`${item.uuid}-${idx}`} item={item} isFirst={idx === 0} />
      ))}
    </div>
  );
}
