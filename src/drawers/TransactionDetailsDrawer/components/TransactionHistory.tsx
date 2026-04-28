import { cn } from '@/utils/cn';
import type { TransactionHistoryItem } from '@/types/transactions/transactionDetails.types';

function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const dd = d.getDate().toString().padStart(2, '0');
  const yy = d.getFullYear().toString().slice(2);
  return `${dd} ${months[d.getMonth()]}, ${yy}`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  const ss = d.getSeconds().toString().padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

function splitSeconds(time: string): [string, string] {
  const lastColon = time.lastIndexOf(':');
  return [time.slice(0, lastColon + 1), time.slice(lastColon + 1)];
}

function TimeDisplay({ time }: { time: string }) {
  const [prefix, seconds] = splitSeconds(time);
  return (
    <span>
      {prefix}
      <span className="text-[#ff4343]">{seconds}</span>
    </span>
  );
}

function StatusBadge({ type }: { type: string }) {
  const label = type.charAt(0) + type.slice(1).toLowerCase();
  return (
    <span className="rounded px-1 py-0.5 text-xs font-medium uppercase text-[#1e8f1f] bg-[#c6f3da]">
      {label}
    </span>
  );
}

interface HistoryItemProps {
  item: TransactionHistoryItem;
  isActive: boolean;
  isLast: boolean;
}

function HistoryItem({ item, isActive, isLast }: HistoryItemProps) {
  const date = formatDate(item.CreatedAt);
  const time = formatTime(item.CreatedAt);

  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'mt-1 h-3.5 w-3.5 shrink-0 rounded-full',
            isActive ? 'bg-[#f7941d]' : 'border-2 border-[#d0d0d0] bg-white'
          )}
        />
        {!isLast && (
          <div
            className="mt-1 flex-1 border-l border-dashed border-[#d0d0d0]"
            style={{ minHeight: 32 }}
          />
        )}
      </div>

      <div className="flex-1 pb-6">
        {isActive ? (
          <div className="rounded-[15px] border border-[#f7941d] bg-[#fff6e6] p-4 flex flex-col gap-1">
            <div className="flex items-center gap-2.5">
              <span className="text-sm font-semibold text-[#1a1a1a] underline">
                {item.CurrencyCode} {item.amount.toLocaleString()}
              </span>
              <StatusBadge type={item.event} />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="border-r border-[#e5e5e5] pr-1.5 text-[#1a1a1a]">
                {date}&nbsp;&nbsp;
                <TimeDisplay time={time} />
              </span>
              <span className="pl-1.5 text-[#808080]">
                {date}&nbsp;&nbsp;{time}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1 px-4">
            <div className="flex items-center gap-2.5">
              <span className="text-sm text-[#1a1a1a] underline">
                {item.CurrencyCode} {item.amount.toLocaleString()}
              </span>
              <StatusBadge type={item.event} />
            </div>
            <div className="flex items-center gap-1 text-sm">
              <span className="border-r border-[#e5e5e5] pr-1.5 text-[#1a1a1a]">
                {date}&nbsp;&nbsp;
                <TimeDisplay time={time} />
              </span>
              <span className="pl-1.5 text-[#808080]">
                {date}&nbsp;&nbsp;{time}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface TransactionHistoryProps {
  items: TransactionHistoryItem[];
}

export function TransactionHistory({ items }: TransactionHistoryProps) {
  if (!items.length) return null;
  return (
    <div className="flex flex-col">
      {items.map((item, index) => (
        <HistoryItem
          key={`${item.uuid}-${index}`}
          item={item}
          isActive={index === 0}
          isLast={index === items.length - 1}
        />
      ))}
    </div>
  );
}
