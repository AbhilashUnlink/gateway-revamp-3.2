import type { RegisterOptions } from 'react-hook-form';

// ── Field types ───────────────────────────────────────────────────────────

export type FieldType = 'input' | 'select' | 'radio' | 'checkbox';

interface BaseFieldSchema {
  name: string;
  type: FieldType;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  colSpan?: 1 | 2 | 3 | 4;
  disabled?: boolean;
}

export interface InputFieldSchema extends BaseFieldSchema {
  type: 'input';
  inputType?: 'text' | 'password' | 'email' | 'number' | 'tel';
  icon?: React.ElementType;
}

// Union grows as new field types are registered
export type FieldSchema = InputFieldSchema;

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
  actions: ActionSchema[];
}
