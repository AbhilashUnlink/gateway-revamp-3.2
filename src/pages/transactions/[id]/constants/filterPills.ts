import type { InfoFilter } from '../types';

export interface FilterPill {
  value: InfoFilter;
  labelKey: string;
}

export const FILTER_PILLS: FilterPill[] = [
  { value: 'all', labelKey: 'transaction_details_page.filter_all' },
  { value: 'transaction', labelKey: 'transaction_details_page.section_transaction_info' },
  { value: 'merchant', labelKey: 'transaction_details_page.section_merchant_info' },
  { value: 'payment', labelKey: 'transaction_details_page.section_payment_card_info' },
  { value: 'subscription', labelKey: 'transaction_details_page.section_subscription_info' },
  { value: 'browser', labelKey: 'transaction_details_page.section_browser_info' },
  { value: 'additional', labelKey: 'transaction_details_page.section_additional_info' },
];
