import type { FilterField, FilterRule, FilterValue } from '../types';

export const newRuleId = () => `r_${Math.random().toString(36).slice(2, 10)}`;

export const blankValueFor = (type: FilterField['type']): FilterValue =>
  type === 'multiSelect' ? [] : type === 'dateRange' ? {} : '';

/** A rule is "complete" when its value is non-empty for its type. */
export function isRuleComplete(rule: FilterRule, fields: FilterField[]): boolean {
  if (!rule.field) return false;
  const field = fields.find((f) => f.id === rule.field);
  if (!field) return false;
  const v = rule.value;
  switch (field.type) {
    case 'text':
    case 'select':
      return typeof v === 'string' && v.trim().length > 0;
    case 'number':
      return v !== '' && v !== null && v !== undefined;
    case 'multiSelect':
      return Array.isArray(v) && v.length > 0;
    case 'dateRange':
      return !!v && typeof v === 'object' && !Array.isArray(v) && !!v.from && !!v.to;
    default:
      return false;
  }
}
