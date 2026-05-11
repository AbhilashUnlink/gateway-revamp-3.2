import { InputField } from './fields/InputField';
import { TextareaField } from './fields/TextareaField';
import { CheckboxField } from './fields/CheckboxField';
import { DisplayField } from './fields/DisplayField';
import { SelectField } from './fields/SelectField';
import { MultiSelectField } from './fields/MultiSelectField';
import { DateField } from './fields/DateField';
import type { FieldType, FieldSchema } from '@/types/form/form.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldComponent = React.ComponentType<{ field: any }>;

export const fieldComponentMap: Partial<Record<FieldType, FieldComponent>> = {
  input: InputField as FieldComponent,
  textarea: TextareaField as FieldComponent,
  checkbox: CheckboxField as FieldComponent,
  display: DisplayField as FieldComponent,
  select: SelectField as FieldComponent,
  multiselect: MultiSelectField as FieldComponent,
  date: DateField as FieldComponent,
};

export type { FieldSchema };
