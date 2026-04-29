import type { FilterRule, SerializedFilterEntry } from './types';
import { OPERATORS } from './operators';

/**
 * Format ISO datetime → `yyyy/MM/dd HH:mm:ss` in local timezone.
 * Mirrors the old UI's `filterDateFormatterNoTimeZone` shape.
 */
function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return (
    `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ` +
    `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  );
}

/**
 * Transactions screen — array payload with `{ field, operator, value }`.
 * Date ranges (operator: 'between') are split into two `eq` entries:
 *   `<field>Start` and `<field>End`, dates formatted `yyyy/MM/dd HH:mm:ss`.
 * Every entry after the first carries `operand: 'AND'`.
 */
export function serializeForTransactions(rules: FilterRule[]): SerializedFilterEntry[] {
  const out: SerializedFilterEntry[] = [];

  for (const r of rules) {
    if (
      r.operator === OPERATORS.BETWEEN &&
      r.value &&
      typeof r.value === 'object' &&
      !Array.isArray(r.value)
    ) {
      const range = r.value as { from?: string; to?: string };
      if (range.from) {
        out.push({
          field: `${r.field}Start`,
          operator: OPERATORS.EQUAL,
          value: formatDateTime(range.from),
        });
      }
      if (range.to) {
        out.push({
          field: `${r.field}End`,
          operator: OPERATORS.EQUAL,
          value: formatDateTime(range.to),
        });
      }
    } else {
      out.push({ field: r.field, operator: r.operator, value: r.value as unknown });
    }
  }

  // Tag every entry after the first with `operand: AND`.
  return out.map((entry, i) => (i === 0 ? entry : { ...entry, operand: 'AND' as const }));
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
      if (v.from) params.set(`${r.field}Start`, formatDateTime(v.from));
      if (v.to) params.set(`${r.field}End`, formatDateTime(v.to));
    }
  }

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export type ScreenSerializer = 'transactions' | 'merchants';

export function serializeFilters(rules: FilterRule[], screen: ScreenSerializer) {
  return screen === 'merchants' ? serializeForMerchants(rules) : serializeForTransactions(rules);
}

// ── Preset save / load ────────────────────────────────────────────────────

/**
 * Build the preset-save payload. Mirrors legacy backend contract:
 *   filter_json:           [{HeaderColumn, Name}]   — original UI rule shape
 *   raw_transformed_filter: [{field, operator, value}, ...] — server payload
 */
export function buildPresetSavePayload(rules: FilterRule[]): {
  filter_json: string;
  raw_transformed_filter: string;
} {
  const filterJsonEntries = rules.map((r) => ({ HeaderColumn: r.field, Name: r.value }));
  return {
    filter_json: JSON.stringify(filterJsonEntries),
    raw_transformed_filter: JSON.stringify(serializeForTransactions(rules)),
  };
}

const newRuleId = () => `r_${Math.random().toString(36).slice(2, 10)}`;

/**
 * Restore FilterRule[] from a preset's `filter_json` string.
 * Each entry has shape { HeaderColumn: <fieldId>, Name: <value> }.
 * Operator is re-derived from the caller-provided operator-by-field map so the
 * rule round-trips even if the saved operator drifts from current schema rules.
 * Unknown fields (no entry in `operatorByField`) are dropped silently.
 */
export function deserializeFromPreset(
  filterJson: string,
  operatorByField: Record<string, string>
): FilterRule[] {
  let entries: Array<{ HeaderColumn: string; Name: unknown }> = [];
  try {
    const parsed = JSON.parse(filterJson);
    if (Array.isArray(parsed)) entries = parsed;
  } catch {
    return [];
  }

  return entries
    .map<FilterRule | null>((e) => {
      if (!e || typeof e !== 'object' || !('HeaderColumn' in e)) return null;
      const operator = operatorByField[e.HeaderColumn];
      if (!operator) return null;
      return {
        id: newRuleId(),
        field: e.HeaderColumn,
        operator,
        value: e.Name as FilterRule['value'],
      };
    })
    .filter((r): r is FilterRule => r !== null);
}
