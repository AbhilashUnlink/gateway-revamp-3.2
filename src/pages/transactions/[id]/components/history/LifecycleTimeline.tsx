import { memo } from 'react';
import { cn } from '@/utils/cn';
import type { TransactionHistoryItem } from '@/types/transactions/transactionDetails.types';
import { TimelineDot } from '../primitives';
import { formatDateOnly, formatTimeOnly } from '../../utils';

interface EventCardProps {
  item: TransactionHistoryItem;
  isFirst: boolean;
}

const EventCard = memo(function EventCard({ item, isFirst }: EventCardProps) {
  const label = (item.event ?? '').toUpperCase();
  const amount = item.amount?.toFixed?.(2) ?? item.amount;

  return (
    <div className="flex min-w-[252px] flex-1 flex-col gap-2">
      <div className="flex items-center gap-2">
        <TimelineDot active={isFirst} />
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
          {item.CurrencyCode} {amount}
        </span>
        <span className="text-sm leading-5 text-[#1a1a1a]">
          {formatDateOnly(item.CreatedAt)}{' '}
          <span className="text-[#808080]">| {formatTimeOnly(item.CreatedAt)}</span>
        </span>
      </div>
    </div>
  );
});

interface LifecycleTimelineProps {
  items: TransactionHistoryItem[];
}

export function LifecycleTimeline({ items }: LifecycleTimelineProps) {
  if (!items?.length) return null;
  return (
    <div className="relative flex items-start gap-6 px-6 py-6">
      <div className="absolute left-9 right-9 top-3.5 -z-0 border-t border-dashed border-[#d0d0d0]" />
      {items.map((item, idx) => (
        <EventCard key={`${item.uuid}-${idx}`} item={item} isFirst={idx === 0} />
      ))}
    </div>
  );
}
