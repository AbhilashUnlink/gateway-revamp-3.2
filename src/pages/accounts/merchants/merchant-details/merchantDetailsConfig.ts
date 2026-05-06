import type { DasIconName } from '@/components/ui/das-icon';

export type MerchantTabId =
  | 'merchant-information'
  | 'product-information'
  | 'user-management'
  | 'merchant-settings'
  | 'merchant-catalogue';

export interface MerchantTabConfig {
  id: MerchantTabId;
  labelKey: string;
  icon: DasIconName;
  hasDropdown?: boolean;
  enabled: boolean;
}

export const MERCHANT_DETAIL_TABS: MerchantTabConfig[] = [
  {
    id: 'merchant-information',
    labelKey: 'merchant_details_page.tab_merchant_information',
    icon: 'receipt-text',
    enabled: true,
  },
  {
    id: 'product-information',
    labelKey: 'merchant_details_page.tab_product_information',
    icon: 'info',
    enabled: true,
  },
  {
    id: 'user-management',
    labelKey: 'merchant_details_page.tab_user_management',
    icon: 'user-cog',
    enabled: true,
  },
  {
    id: 'merchant-settings',
    labelKey: 'merchant_details_page.tab_merchant_settings',
    icon: 'user-check',
    hasDropdown: true,
    enabled: true,
  },
  {
    id: 'merchant-catalogue',
    labelKey: 'merchant_details_page.tab_merchant_catalogue',
    icon: 'archive',
    enabled: true,
  },
];

export type MerchantInfoFilter = 'all' | 'business-details' | 'contact-details';

export interface MerchantInfoPill {
  value: MerchantInfoFilter;
  labelKey: string;
}

export const MERCHANT_INFO_PILLS: MerchantInfoPill[] = [
  { value: 'all', labelKey: 'merchant_details_page.pill_all' },
  { value: 'business-details', labelKey: 'merchant_details_page.pill_business_details' },
  { value: 'contact-details', labelKey: 'merchant_details_page.pill_contact_details' },
];

const COUNTRY_LABELS: Record<string, string> = {
  JP: 'Japan',
  SG: 'Singapore',
  HK: 'Hong Kong',
  US: 'United States',
  GB: 'United Kingdom',
  IN: 'India',
};

const SUBSIDIARY_LABELS: Record<string, string> = {
  JP: 'PO Japan',
  SG: 'PO Singapore',
  HK: 'PO Hong Kong',
};

export function formatCountry(code: string): string {
  if (!code) return '';
  return COUNTRY_LABELS[code] ?? code;
}

export function formatSubsidiary(code: string): string {
  if (!code) return '';
  return SUBSIDIARY_LABELS[code] ?? code;
}
