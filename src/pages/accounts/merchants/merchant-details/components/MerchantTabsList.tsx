import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { DasIcon } from '@/components/ui/das-icon';
import { MERCHANT_DETAIL_TABS, type MerchantTabId } from '../merchantDetailsConfig';
import { MERCHANT_SETTINGS } from '../settings/merchantSettingsConfig';

interface MerchantTabsListProps {
  activeTabId: MerchantTabId;
  onTabChange: (id: MerchantTabId) => void;
  activeSettingId: string;
  onSettingChange: (id: string) => void;
}

export function MerchantTabsList({
  activeTabId,
  onTabChange,
  activeSettingId,
  onSettingChange,
}: MerchantTabsListProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-6">
      {MERCHANT_DETAIL_TABS.map((tab) => {
        const { id, labelKey, icon, hasDropdown, enabled } = tab;
        const selected = activeTabId === id;
        const baseCls = cn(
          'flex items-center gap-2 border-b-2 px-0 py-3 text-base outline-none transition-colors',
          selected && enabled
            ? 'border-[#f7941d] font-semibold text-[#f7941d]'
            : 'border-transparent font-normal text-[#4d4d4d]',
          !enabled && 'cursor-not-allowed opacity-60'
        );

        if (hasDropdown && id === 'merchant-settings') {
          return (
            <Menu key={id} as="div" className="relative">
              <MenuButton
                disabled={!enabled}
                onClick={() => enabled && onTabChange(id)}
                className={baseCls}
              >
                <DasIcon name={icon} size={20} />
                <span>{t(labelKey)}</span>
                <DasIcon name="chevron-down" size={16} />
              </MenuButton>
              <MenuItems
                anchor="bottom start"
                className="z-[60] mt-2 w-64 origin-top-left rounded-xl border border-[#e5e5e5] bg-white p-1 shadow-[0px_8px_24px_rgba(0,0,0,0.12)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
              >
                {MERCHANT_SETTINGS.map((s) => (
                  <MenuItem key={s.id}>
                    {({ focus }) => (
                      <button
                        type="button"
                        onClick={() => {
                          onTabChange('merchant-settings');
                          onSettingChange(s.id);
                        }}
                        className={cn(
                          'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm',
                          activeSettingId === s.id
                            ? 'font-semibold text-[#f7941d]'
                            : 'text-[#1a1a1a]',
                          focus && 'bg-[#fafafa]'
                        )}
                      >
                        {s.icon && <DasIcon name={s.icon} size={16} />}
                        <span>{t(s.labelKey)}</span>
                      </button>
                    )}
                  </MenuItem>
                ))}
              </MenuItems>
            </Menu>
          );
        }

        return (
          <button
            key={id}
            type="button"
            disabled={!enabled}
            onClick={() => enabled && onTabChange(id)}
            className={baseCls}
          >
            <DasIcon name={icon} size={20} />
            <span>{t(labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
