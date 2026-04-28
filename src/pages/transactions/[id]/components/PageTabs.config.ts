import { ReceiptText, Archive, Calendar, Coins, FileText } from 'lucide-react';

export interface TabConfig {
  id: string;
  labelKey: string;
  Icon: typeof ReceiptText;
  enabled: boolean;
}

export const PAGE_TABS: TabConfig[] = [
  {
    id: 'transaction-history',
    labelKey: 'transaction_details_page.tab_transaction_history',
    Icon: ReceiptText,
    enabled: true,
  },
  {
    id: 'chargeback-history',
    labelKey: 'transaction_details_page.tab_chargeback_history',
    Icon: Archive,
    enabled: true,
  },
  {
    id: 'subscription-history',
    labelKey: 'transaction_details_page.tab_subscription_history',
    Icon: Calendar,
    enabled: true,
  },
  {
    id: 'tokenization-history',
    labelKey: 'transaction_details_page.tab_tokenization_history',
    Icon: Coins,
    enabled: true,
  },
  {
    id: 'audit-log',
    labelKey: 'transaction_details_page.tab_audit_log',
    Icon: FileText,
    enabled: true,
  },
];
