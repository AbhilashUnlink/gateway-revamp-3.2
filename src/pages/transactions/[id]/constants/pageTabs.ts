import type { ComponentType, SVGProps } from 'react';
import {
  ArchiveIcon,
  BuyCryptoIcon,
  CalendarIcon,
  ReceiptEditIcon,
  ReceiptIcon,
} from '@/assets/icons/transaction-tabs';

export type PageTabId =
  | 'transaction-history'
  | 'chargeback-history'
  | 'subscription-history'
  | 'tokenization-history'
  | 'audit-log';

export type TabIconComponent = ComponentType<SVGProps<SVGSVGElement>>;

export interface TabConfig {
  id: PageTabId;
  labelKey: string;
  Icon: TabIconComponent;
  enabled: boolean;
}

export const PAGE_TABS: TabConfig[] = [
  {
    id: 'transaction-history',
    labelKey: 'transaction_details_page.tab_transaction_history',
    Icon: ReceiptIcon,
    enabled: true,
  },
  {
    id: 'chargeback-history',
    labelKey: 'transaction_details_page.tab_chargeback_history',
    Icon: ArchiveIcon,
    enabled: true,
  },
  {
    id: 'subscription-history',
    labelKey: 'transaction_details_page.tab_subscription_history',
    Icon: CalendarIcon,
    enabled: true,
  },
  {
    id: 'tokenization-history',
    labelKey: 'transaction_details_page.tab_tokenization_history',
    Icon: BuyCryptoIcon,
    enabled: true,
  },
  {
    id: 'audit-log',
    labelKey: 'transaction_details_page.tab_audit_log',
    Icon: ReceiptEditIcon,
    enabled: true,
  },
];
