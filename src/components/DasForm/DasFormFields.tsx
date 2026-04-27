import { renderField } from '@/utils/renderFields';
import { useDasFormContext } from './DasFormContext';
import { cn } from '@/utils/cn';

const GRID_COLS: Record<1 | 2 | 3 | 4, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
};

const FIELD_GAP: Record<4 | 6 | 8 | 10, string> = {
  4: 'gap-4',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
};

interface DasFormFieldsProps {
  className?: string;
}

export function DasFormFields({ className }: DasFormFieldsProps) {
  const { schema } = useDasFormContext();
  const cols = (schema.columns ?? 1) as 1 | 2 | 3 | 4;
  const gap = (schema.fieldGap ?? 6) as 4 | 6 | 8 | 10;

  return (
    <div className={cn('grid', GRID_COLS[cols], FIELD_GAP[gap], className)}>
      {schema.fields.map((field) => renderField(field))}
    </div>
  );
}
