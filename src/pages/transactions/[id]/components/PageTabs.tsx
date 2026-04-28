import { Tab, TabList } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { PAGE_TABS } from './PageTabs.config';

export function PageTabsList() {
  const { t } = useTranslation();

  return (
    <TabList className="flex items-center gap-6">
      {PAGE_TABS.map(({ id, labelKey, Icon, enabled }) => (
        <Tab
          key={id}
          disabled={!enabled}
          className={({ selected }) =>
            cn(
              'flex items-center gap-2 border-b-2 px-0 py-3 text-base outline-none transition-colors',
              selected && enabled
                ? 'border-[#f7941d] font-semibold text-[#f7941d]'
                : 'border-transparent font-normal text-[#4d4d4d]',
              !enabled && 'cursor-not-allowed opacity-60'
            )
          }
        >
          <Icon size={20} />
          <span>{t(labelKey)}</span>
        </Tab>
      ))}
    </TabList>
  );
}
