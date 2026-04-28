import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { InfoSectionConfig } from '../utils/buildSections';
import { InfoFieldItem } from './InfoFieldItem';

interface InfoSectionProps {
  section: InfoSectionConfig;
  layout: 'column' | 'grid';
}

export function InfoSection({ section, layout }: InfoSectionProps) {
  const { t } = useTranslation();
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-4">
      <div className="border-b border-[#e5e5e5] pb-4">
        <h3 className="text-base font-semibold leading-5 text-[#1a1a1a]">{t(section.titleKey)}</h3>
      </div>
      <div
        className={cn('gap-x-5 gap-y-5', layout === 'grid' ? 'grid grid-cols-5' : 'flex flex-col')}
      >
        {section.fields.map((field, idx) => (
          <InfoFieldItem key={`${section.id}-${idx}`} field={field} />
        ))}
      </div>
    </div>
  );
}
