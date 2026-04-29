import type { FilterFieldType } from './types';

export const OPERATORS = {
  EQUAL: 'eq',
  IN: 'in',
  CONTAINS: 'contains',
  BETWEEN: 'between',
} as const;

/**
 * Operator is implicit per field type — never exposed as a UI dropdown.
 * multiSelect always uses `in` since values are arrays.
 */
export function inferOperator(type: FilterFieldType): string {
  switch (type) {
    case 'text':
      return OPERATORS.CONTAINS;
    case 'number':
      return OPERATORS.EQUAL;
    case 'dateRange':
      return OPERATORS.BETWEEN;
    case 'select':
      return OPERATORS.EQUAL;
    case 'multiSelect':
      return OPERATORS.IN;
    default:
      return OPERATORS.EQUAL;
  }
}
