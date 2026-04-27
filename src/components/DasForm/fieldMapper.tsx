import { InputField } from './fields/InputField';
import type { FieldType, FieldSchema } from '@/types/form/form.types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FieldComponent = React.ComponentType<{ field: any }>;

/**
 * Maps field `type` strings to their renderer components.
 * Add new entries here as field types are implemented.
 */
export const fieldComponentMap: Partial<Record<FieldType, FieldComponent>> = {
  input: InputField as FieldComponent,
};

export type { FieldSchema };
