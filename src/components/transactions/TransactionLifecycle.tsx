import { memo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';
import type { TransactionHistoryItem } from '@/types/transactions/transactionDetails.types';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';
import { splitSeconds } from '@/utils/formatDate';

type Orientation = 'horizontal' | 'vertical';

function StatusBadge({ type }: { type: string }) {
  const label = type.charAt(0) + type.slice(1).toLowerCase();
  return (
    <span className="rounded bg-[#c6f3da] px-1 py-0.5 text-xs font-medium uppercase text-[#1e8f1f]">
      {label}
    </span>
  );
}

interface WrapperProps {
  uuid: string;
  isActive: boolean;
  className: string;
  onSelect?: (uuid: string) => void;
  children: ReactNode;
}

function ItemWrapper({ uuid, isActive, className, onSelect, children }: WrapperProps) {
  if (onSelect) {
    return (
      <div
        role="button"
        tabIndex={0}
        className={cn('cursor-pointer', className)}
        onClick={() => {
          if (!isActive) onSelect(uuid);
        }}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isActive) {
            e.preventDefault();
            onSelect(uuid);
          }
        }}
      >
        {children}
      </div>
    );
  }
  return (
    <Link to={`/transactions/${uuid}`} className={className}>
      {children}
    </Link>
  );
}

const HorizontalCard = memo(function HorizontalCard({
  item,
  isActive,
}: {
  item: TransactionHistoryItem;
  isActive: boolean;
}) {
  const formatDate = useUserDateFormat();
  const label = (item.event ?? '').toUpperCase();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-3.5 items-center gap-2">
        <span
          className={cn(
            'inline-block shrink-0 rounded-full',
            isActive ? 'h-3.5 w-3.5 bg-[var(--brand-color)]' : 'ml-[3px] h-2 w-2 bg-[#d0d0d0]'
          )}
        />
        <span
          className={cn(
            'text-xs font-medium uppercase leading-none',
            isActive ? 'text-[var(--brand-color)]' : 'text-[#808080]'
          )}
        >
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3 pl-3">
        <span className="text-sm font-semibold leading-5 text-[#1a1a1a]">
          {item.CurrencyCode} {item.amount?.toFixed?.(2) ?? item.amount}
        </span>
        <span className="whitespace-nowrap text-sm leading-5 text-[#808080]">
          {formatDate(item.CreatedAt)}
        </span>
      </div>
    </div>
  );
});

function HorizontalSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-3.5 items-center gap-2">
        <span className="ml-[3px] inline-block h-2 w-2 shrink-0 animate-pulse rounded-full bg-neutral-200" />
        <span className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
      </div>
      <div className="flex h-5 items-center gap-3 pl-3">
        <span className="h-3 w-16 animate-pulse rounded bg-neutral-200" />
        <span className="h-3 w-28 animate-pulse rounded bg-neutral-100" />
      </div>
    </div>
  );
}

const VerticalCard = memo(function VerticalCard({
  item,
  isActive,
  isLast,
}: {
  item: TransactionHistoryItem;
  isActive: boolean;
  isLast: boolean;
}) {
  const formatDate = useUserDateFormat();
  const formatted = formatDate(item.CreatedAt) || '—';
  const { head, tail } = splitSeconds(formatted);
  return (
    <div className="flex w-full gap-3">
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
        <div
          className={cn(
            'flex flex-col gap-1',
            isActive ? 'rounded-[15px] border border-[#f7941d] bg-[#fff6e6] p-4' : 'px-4'
          )}
        >
          <div className="flex items-center gap-2.5">
            <span
              className={cn('text-sm text-[#1a1a1a] underline', isActive ? 'font-semibold' : '')}
            >
              {item.CurrencyCode} {item.amount.toLocaleString()}
            </span>
            <StatusBadge type={item.event} />
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="border-r border-[#e5e5e5] pr-1.5 text-[#1a1a1a]">
              {head}
              {tail && <span className="text-[#ff4343]">{tail}</span>}
            </span>
            <span className="pl-1.5 text-[#808080]">{formatted}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

function VerticalSkeleton({ isLast }: { isLast: boolean }) {
  return (
    <div className="flex w-full gap-3">
      <div className="flex flex-col items-center">
        <div className="mt-1 h-3.5 w-3.5 shrink-0 animate-pulse rounded-full bg-neutral-200" />
        {!isLast && (
          <div
            className="mt-1 flex-1 border-l border-dashed border-[#d0d0d0]"
            style={{ minHeight: 32 }}
          />
        )}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex flex-col gap-1 px-4">
          <div className="flex h-5 items-center gap-2.5">
            <span className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
            <span className="h-4 w-14 animate-pulse rounded bg-neutral-200" />
          </div>
          <div className="flex h-5 items-center">
            <span className="h-3 w-40 animate-pulse rounded bg-neutral-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

interface TransactionLifecycleProps {
  items: TransactionHistoryItem[];
  activeUuid: string;
  orientation: Orientation;
  loading?: boolean;
  skeletonCount?: number;
  onSelect?: (uuid: string) => void;
}

export function TransactionLifecycle({
  items,
  activeUuid,
  orientation,
  loading = false,
  skeletonCount = 4,
  onSelect,
}: TransactionLifecycleProps) {
  const showSkeleton = loading;

  if (orientation === 'horizontal') {
    if (!showSkeleton && !items?.length) return null;
    const cardClass = 'block w-[252px] shrink-0';
    return (
      <div className="overflow-x-auto">
        <div className="relative flex w-max items-start gap-6 px-6 py-6">
          <div className="pointer-events-none absolute left-[31px] right-[31px] top-[31px] -z-0 border-t border-dashed border-[#d0d0d0]" />
          {showSkeleton
            ? Array.from({ length: skeletonCount }).map((_, idx) => (
                <div key={idx} className={cardClass}>
                  <HorizontalSkeleton />
                </div>
              ))
            : items.map((item, idx) => {
                const isActive = item.uuid === activeUuid;
                return (
                  <ItemWrapper
                    key={`${item.uuid}-${idx}`}
                    uuid={item.uuid}
                    isActive={isActive}
                    onSelect={onSelect}
                    className={cardClass}
                  >
                    <HorizontalCard item={item} isActive={isActive} />
                  </ItemWrapper>
                );
              })}
        </div>
      </div>
    );
  }

  if (!showSkeleton && !items?.length) return null;
  return (
    <div className="flex flex-col">
      {showSkeleton
        ? Array.from({ length: skeletonCount }).map((_, idx) => (
            <VerticalSkeleton key={idx} isLast={idx === skeletonCount - 1} />
          ))
        : items.map((item, idx) => {
            const isActive = item.uuid === activeUuid;
            const isLast = idx === items.length - 1;
            return (
              <ItemWrapper
                key={`${item.uuid}-${idx}`}
                uuid={item.uuid}
                isActive={isActive}
                onSelect={onSelect}
                className="flex"
              >
                <VerticalCard item={item} isActive={isActive} isLast={isLast} />
              </ItemWrapper>
            );
          })}
    </div>
  );
}
