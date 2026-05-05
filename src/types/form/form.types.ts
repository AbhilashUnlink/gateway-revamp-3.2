import type { RegisterOptions } from 'react-hook-form';
import type { DasIconName } from '@/components/ui/DasIcon';

// ── Field types ───────────────────────────────────────────────────────────

export type FieldType = 'input' | 'textarea' | 'checkbox' | 'display' | 'select' | 'date' | 'radio';

interface BaseFieldSchema {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  colSpan?: 1 | 2 | 3 | 4;
  disabled?: boolean;
  hint?: string;
  required?: boolean;
}

export interface InputFieldSchema extends BaseFieldSchema {
  type: 'input';
  inputType?: 'text' | 'password' | 'email' | 'number' | 'tel';
  icon?: DasIconName;
  suffix?: string;
}

export interface TextareaFieldSchema extends BaseFieldSchema {
  type: 'textarea';
  maxLength?: number;
  rows?: number;
}

export interface CheckboxFieldSchema extends BaseFieldSchema {
  type: 'checkbox';
}

export interface DisplayFieldSchema extends BaseFieldSchema {
  type: 'display';
  value: string;
  suffix?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldSchema extends BaseFieldSchema {
  type: 'select';
  options: SelectOption[];
}

export interface DateFieldSchema extends BaseFieldSchema {
  type: 'date';
}

// Union grows as new field types are registered
export type FieldSchema =
  | InputFieldSchema
  | TextareaFieldSchema
  | CheckboxFieldSchema
  | DisplayFieldSchema
  | SelectFieldSchema
  | DateFieldSchema;

// ── Action types ──────────────────────────────────────────────────────────

export type ActionType = 'submit' | 'cancel' | 'reset';

export interface ActionSchema {
  type: ActionType;
  label: string;
  loadingLabel?: string;
}

// ── Form schema ───────────────────────────────────────────────────────────

export interface FormSchema {
  columns?: 1 | 2 | 3 | 4;
  fieldGap?: 4 | 6 | 8 | 10;
  fields: FieldSchema[];
  actions?: ActionSchema[];
}
