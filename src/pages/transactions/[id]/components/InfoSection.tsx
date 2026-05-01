/* eslint-disable react-refresh/only-export-components */
import { memo, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import type { InfoSectionConfig } from '../types';
import { InfoFieldItem } from './InfoFieldItem';

type Layout = 'column' | 'grid';

interface RootProps {
  children: ReactNode;
  className?: string;
}

function Root({ children, className }: RootProps) {
  return <div className={cn('flex min-w-0 flex-1 flex-col gap-4', className)}>{children}</div>;
}

interface TitleProps {
  children: ReactNode;
}

function Title({ children }: TitleProps) {
  return (
    <div className="border-b border-[#e5e5e5] pb-4">
      <h3 className="text-base font-semibold leading-5 text-[#1a1a1a]">{children}</h3>
    </div>
  );
}

interface FieldsProps {
  layout: Layout;
  children: ReactNode;
}

function Fields({ layout, children }: FieldsProps) {
  return (
    <div
      className={cn('gap-x-5 gap-y-5', layout === 'grid' ? 'grid grid-cols-5' : 'flex flex-col')}
    >
      {children}
    </div>
  );
}

interface InfoSectionProps {
  section: InfoSectionConfig;
  layout: Layout;
}

export const InfoSectionHeader = memo(function InfoSectionHeader({
  section,
}: {
  section: InfoSectionConfig;
}) {
  const { t } = useTranslation();
  return (
    <div className="min-w-0 flex-1 border-b border-[#e5e5e5] pb-4">
      <h3 className="text-base font-semibold leading-5 text-[#1a1a1a]">{t(section.titleKey)}</h3>
    </div>
  );
});

export const InfoSectionBody = memo(function InfoSectionBody({
  section,
  layout,
}: InfoSectionProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <Fields layout={layout}>
        {section.fields.map((field, idx) => (
          <InfoFieldItem key={`${section.id}-${idx}`} field={field} />
        ))}
      </Fields>
    </div>
  );
});

const InfoSectionComponent = memo(function InfoSection({ section, layout }: InfoSectionProps) {
  const { t } = useTranslation();
  return (
    <Root>
      <Title>{t(section.titleKey)}</Title>
      <Fields layout={layout}>
        {section.fields.map((field, idx) => (
          <InfoFieldItem key={`${section.id}-${idx}`} field={field} />
        ))}
      </Fields>
    </Root>
  );
});

export const InfoSection = Object.assign(InfoSectionComponent, {
  Root,
  Title,
  Fields,
  Header: InfoSectionHeader,
  Body: InfoSectionBody,
});
