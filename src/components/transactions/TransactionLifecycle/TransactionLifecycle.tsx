import type { TransactionHistoryItem } from '@/types/transactions/transactionDetails.types';
import { HorizontalCard, ItemWrapper, VerticalCard } from './components';
import { HorizontalSkeleton, VerticalSkeleton } from './skeletons';

type Orientation = 'horizontal' | 'vertical';

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
                    <HorizontalCard.View item={item} isActive={isActive} />
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
                <VerticalCard.View item={item} isActive={isActive} isLast={isLast} />
              </ItemWrapper>
            );
          })}
    </div>
  );
}
