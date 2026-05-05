/* eslint-disable react-refresh/only-export-components */
import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { TransactionHistoryItem } from '@/types/transactions/transactionDetails.types';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';
import { splitSeconds } from '@/utils/formatDate';
import { StatusBadge } from './StatusBadge';

interface RootProps {
  children: ReactNode;
}

function Root({ children }: RootProps) {
  return <div className="flex w-full gap-3">{children}</div>;
}

interface RailProps {
  isActive: boolean;
  isLast: boolean;
}

function Rail({ isActive, isLast }: RailProps) {
  return (
    <div className="flex flex-col items-center">
      <Dot isActive={isActive} />
      {!isLast && <Connector />}
    </div>
  );
}

interface DotProps {
  isActive: boolean;
}

function Dot({ isActive }: DotProps) {
  return (
    <div
      className={cn(
        'mt-1 h-3.5 w-3.5 shrink-0 rounded-full',
        isActive ? 'bg-[#f7941d]' : 'border-2 border-[#d0d0d0] bg-white'
      )}
    />
  );
}

function Connector() {
  return (
    <div
      className="mt-1 flex-1 border-l border-dashed border-[#d0d0d0]"
      style={{ minHeight: 32 }}
    />
  );
}

interface BodyProps {
  isActive: boolean;
  children: ReactNode;
}

function Body({ isActive, children }: BodyProps) {
  return (
    <div className="flex-1 pb-6">
      <div
        className={cn(
          'flex flex-col gap-1',
          isActive ? 'rounded-[15px] border border-[#f7941d] bg-[#fff6e6] p-4' : 'px-4'
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface AmountProps {
  isActive: boolean;
  currencyCode: string;
  amount: number;
}

function Amount({ isActive, currencyCode, amount }: AmountProps) {
  return (
    <span className={cn('text-sm text-[#1a1a1a] underline', isActive ? 'font-semibold' : '')}>
      {currencyCode} {amount.toLocaleString()}
    </span>
  );
}

interface DateProps {
  head: string;
  tail: string;
  formatted: string;
}

function DateText({ head, tail, formatted }: DateProps) {
  return (
    <div className="flex items-center gap-1 text-sm">
      <span className="border-r border-[#e5e5e5] pr-1.5 text-[#1a1a1a]">
        {head}
        {tail && <span className="text-[#ff4343]">{tail}</span>}
      </span>
      <span className="pl-1.5 text-[#808080]">{formatted}</span>
    </div>
  );
}

interface ViewProps {
  item: TransactionHistoryItem;
  isActive: boolean;
  isLast: boolean;
}

function View({ item, isActive, isLast }: ViewProps) {
  const formatDate = useUserDateFormat();
  const formatted = formatDate(item.CreatedAt) || '—';
  const { head, tail } = splitSeconds(formatted);
  return (
    <Root>
      <Rail isActive={isActive} isLast={isLast} />
      <Body isActive={isActive}>
        <div className="flex items-center gap-2.5">
          <Amount isActive={isActive} currencyCode={item.CurrencyCode} amount={item.amount} />
          <StatusBadge type={item.event} />
        </div>
        <DateText head={head} tail={tail} formatted={formatted} />
      </Body>
    </Root>
  );
}

export const VerticalCard = {
  Root,
  Rail,
  Dot,
  Connector,
  Body,
  Amount,
  Date: DateText,
  View,
};
