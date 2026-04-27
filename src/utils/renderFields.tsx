import { fieldComponentMap } from '@/components/DasForm/fieldMapper';
import type { FieldSchema } from '@/types/form/form.types';
import { cn } from '@/utils/cn';

const COL_SPAN: Record<1 | 2 | 3 | 4, string> = {
  1: 'col-span-1',
  2: 'col-span-2',
  3: 'col-span-3',
  4: 'col-span-4',
};

export function renderField(field: FieldSchema): React.ReactNode {
  const Component = fieldComponentMap[field.type];

  if (!Component) {
    if (import.meta.env.DEV) {
      console.warn(`[DasForm] No renderer registered for field type: "${field.type}"`);
    }
    return null;
  }

  return (
    <div key={field.name} className={cn(COL_SPAN[(field.colSpan ?? 1) as 1 | 2 | 3 | 4])}>
      <Component field={field} />
    </div>
  );
}
