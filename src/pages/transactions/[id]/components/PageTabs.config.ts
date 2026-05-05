import type { DasIconName } from '@/components/ui/DasIcon';

export interface TabConfig {
  id: string;
  labelKey: string;
  icon: DasIconName;
  enabled: boolean;
}

export const PAGE_TABS: TabConfig[] = [
  {
    id: 'transaction-history',
    labelKey: 'transaction_details_page.tab_transaction_history',
    icon: 'receipt-text',
    enabled: true,
  },
  {
    id: 'chargeback-history',
    labelKey: 'transaction_details_page.tab_chargeback_history',
    icon: 'archive',
    enabled: true,
  },
  {
    id: 'subscription-history',
    labelKey: 'transaction_details_page.tab_subscription_history',
    icon: 'calendar',
    enabled: true,
  },
  {
    id: 'tokenization-history',
    labelKey: 'transaction_details_page.tab_tokenization_history',
    icon: 'coins',
    enabled: true,
  },
  {
    id: 'audit-log',
    labelKey: 'transaction_details_page.tab_audit_log',
    icon: 'file-text',
    enabled: true,
  },
];
