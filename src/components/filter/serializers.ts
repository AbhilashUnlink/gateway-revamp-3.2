import type { FilterRule, SerializedFilterEntry } from './types';

/**
 * Transactions screen — array payload with `{ field, operator, value }`.
 * Always AND-joined; `operand` is intentionally not included.
 */
export function serializeForTransactions(rules: FilterRule[]): SerializedFilterEntry[] {
  return rules.map((r) => ({
    field: r.field,
    operator: r.operator,
    value: r.value as unknown,
  }));
}

/**
 * Merchants screen — query string. Mirrors old UI:
 *   ?DASMID=13082681&TimeZone=Asia/Calcutta
 * Multi-values are comma-joined; date ranges are emitted as `<field>Start` /
 * `<field>End` for compatibility with the old `getBody` consumer.
 */
export function serializeForMerchants(rules: FilterRule[]): string {
  const params = new URLSearchParams();

  for (const r of rules) {
    const v = r.value;

    if (typeof v === 'string') {
      params.set(r.field, v);
    } else if (typeof v === 'number') {
      params.set(r.field, String(v));
    } else if (Array.isArray(v)) {
      if (v.length) params.set(r.field, v.join(','));
    } else if (v && typeof v === 'object') {
      if (v.from) params.set(`${r.field}Start`, v.from);
      if (v.to) params.set(`${r.field}End`, v.to);
    }
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export type ScreenSerializer = 'transactions' | 'merchants';

export function serializeFilters(rules: FilterRule[], screen: ScreenSerializer) {
  return screen === 'merchants' ? serializeForMerchants(rules) : serializeForTransactions(rules);
}
