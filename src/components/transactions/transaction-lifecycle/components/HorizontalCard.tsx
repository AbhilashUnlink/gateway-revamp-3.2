/* eslint-disable react-refresh/only-export-components */
import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import type { TransactionHistoryItem } from '@/types/transactions/transactionDetails.types';
import { useUserDateFormat } from '@/hooks/useUserDateFormat';

interface RootProps {
  children: ReactNode;
}

function Root({ children }: RootProps) {
  return <div className="flex flex-col gap-2">{children}</div>;
}

interface DotProps {
  isActive: boolean;
}

function Dot({ isActive }: DotProps) {
  return (
    <span
      className={cn(
        'relative z-10 inline-block shrink-0 rounded-full',
        isActive ? 'h-3.5 w-3.5 bg-[var(--brand-color)]' : 'ml-[3px] h-2 w-2 bg-[#d0d0d0]'
      )}
    />
  );
}

interface LabelProps {
  isActive: boolean;
  children: ReactNode;
}

function Label({ isActive, children }: LabelProps) {
  return (
    <span
      className={cn(
        'relative z-10 bg-white px-1 text-xs font-medium uppercase leading-none',
        isActive ? 'text-[var(--brand-color)]' : 'text-[#808080]'
      )}
    >
      {children}
    </span>
  );
}

interface AmountProps {
  currencyCode: string;
  amount: number;
}

function Amount({ currencyCode, amount }: AmountProps) {
  return (
    <span className="text-sm font-semibold leading-5 text-[#1a1a1a]">
      {currencyCode} {amount?.toFixed?.(2) ?? amount}
    </span>
  );
}

interface DateProps {
  value: string;
}

function DateText({ value }: DateProps) {
  return <span className="whitespace-nowrap text-sm leading-5 text-[#808080]">{value}</span>;
}

interface HeaderProps {
  isActive: boolean;
  children: ReactNode;
}

function Header({ isActive, children }: HeaderProps) {
  return (
    <div className="flex h-3.5 items-center gap-2">
      <Dot isActive={isActive} />
      <Label isActive={isActive}>{children}</Label>
    </div>
  );
}

interface BodyProps {
  children: ReactNode;
}

function Body({ children }: BodyProps) {
  return <div className="flex items-center gap-3 pl-3">{children}</div>;
}

interface ViewProps {
  item: TransactionHistoryItem;
  isActive: boolean;
}

function View({ item, isActive }: ViewProps) {
  const formatDate = useUserDateFormat();
  return (
    <Root>
      <Header isActive={isActive}>{(item.event ?? '').toUpperCase()}</Header>
      <Body>
        <Amount currencyCode={item.CurrencyCode} amount={item.amount} />
        <DateText value={formatDate(item.CreatedAt)} />
      </Body>
    </Root>
  );
}

export const HorizontalCard = { Root, Header, Body, Dot, Label, Amount, Date: DateText, View };
