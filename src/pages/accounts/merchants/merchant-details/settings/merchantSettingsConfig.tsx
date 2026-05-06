import type { ComponentType } from 'react';
import type { DasIconName } from '@/components/ui/das-icon';
import { IpWhitelistSetting } from './IpWhitelistSetting';

export interface MerchantSettingComponentProps {
  merchantId: string;
}

export interface MerchantSettingDefinition {
  id: string;
  labelKey: string;
  icon?: DasIconName;
  component: ComponentType<MerchantSettingComponentProps>;
}

/**
 * Configurable list of items that appear in the Merchant Settings tab dropdown.
 * Add new items here — each one ships as a self-contained component.
 */
export const MERCHANT_SETTINGS: MerchantSettingDefinition[] = [
  {
    id: 'ip-whitelist',
    labelKey: 'merchant_settings.ip_whitelist',
    icon: 'lock',
    component: IpWhitelistSetting,
  },
];

export const DEFAULT_SETTING_ID = MERCHANT_SETTINGS[0]?.id ?? null;
