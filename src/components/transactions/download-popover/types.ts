export type FormatValue = 'csv' | 'excel';

export interface AppliedFilterEntry {
  label: string;
  value: string;
}

export interface ApiFilterEntry {
  field?: string;
  value?: unknown;
  operator?: string;
  operand?: string;
}
