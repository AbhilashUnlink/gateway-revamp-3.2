import { type ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { CopyButton } from '@/components/ui/copy-button';

export type FieldAlign = 'start' | 'end';

export interface DrawerFieldConfig {
  key: string;
  label: string;
  value?: string | number | null;
  copyable?: boolean;
  underline?: boolean;
  align?: FieldAlign;
  custom?: ReactNode;
}

interface DrawerFieldCellProps {
  field: DrawerFieldConfig;
}

export function DrawerFieldCell({ field }: DrawerFieldCellProps) {
  const display =
    field.value === null || field.value === undefined || field.value === ''
      ? 'N/A'
      : String(field.value);
  const isMissing = display === 'N/A';
  const alignEnd = field.align === 'end';

  return (
    <div className={cn('flex h-11 flex-col gap-1', alignEnd && 'items-end')}>
      <span className={cn('h-5 w-full text-sm leading-5 text-[#808080]', alignEnd && 'text-right')}>
        {field.label}
      </span>
      <div className={cn('flex items-center gap-2', alignEnd && 'justify-end')}>
        {field.custom ?? (
          <span
            className={cn(
              'truncate text-sm leading-5',
              isMissing ? 'text-[#808080]' : 'text-[#1a1a1a]',
              field.underline && !isMissing && 'font-semibold underline'
            )}
          >
            {display}
          </span>
        )}
        {field.copyable && !isMissing && !field.custom && <CopyButton value={display} />}
      </div>
    </div>
  );
}

interface DrawerFieldGridProps {
  fields: DrawerFieldConfig[];
  columns?: 1 | 2;
  className?: string;
}

export function DrawerFieldGrid({ fields, columns = 2, className }: DrawerFieldGridProps) {
  return (
    <div
      className={cn(
        'grid gap-x-3 gap-y-3',
        columns === 2 ? 'grid-cols-2' : 'grid-cols-1',
        className
      )}
    >
      {fields.map((field) => (
        <DrawerFieldCell key={field.key} field={field} />
      ))}
    </div>
  );
}

interface DrawerSectionProps {
  title?: string;
  bordered?: boolean;
  children: ReactNode;
  className?: string;
}

export function DrawerSection({ title, bordered = true, children, className }: DrawerSectionProps) {
  return (
    <div
      className={cn(
        'flex w-full flex-col gap-3',
        bordered && 'border-b border-[#e5e5e5] pb-6',
        className
      )}
    >
      {title && <h2 className="text-base font-semibold leading-5 text-[#1a1a1a]">{title}</h2>}
      {children}
    </div>
  );
}
