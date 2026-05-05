import type { DownloadEntry } from '@/store/slices/downloadsSlice';
import type { FilterField, FilterRule } from '@/components/filter/types';
import type { AppliedFilterEntry, ApiFilterEntry } from './types';

type TFunc = (key: string, defaultValue?: string) => string;

export function formatRuleValue(rule: FilterRule): string {
  const v = rule.value;
  if (Array.isArray(v)) return v.length > 0 ? v.join(', ') : '—';
  if (v && typeof v === 'object') {
    const range = v as { from?: string; to?: string };
    if (range.from || range.to) return `${range.from ?? '—'} → ${range.to ?? '—'}`;
    return '—';
  }
  if (v === '' || v === null || v === undefined) return '—';
  return String(v);
}

export function rulesToEntries(
  rules: FilterRule[],
  fields: FilterField[],
  t: TFunc
): AppliedFilterEntry[] {
  const fieldsById = new Map(fields.map((f) => [f.id, f]));
  return rules.map((rule) => {
    const field = fieldsById.get(rule.field);
    return {
      label: field ? t(field.labelKey, field.id) : rule.field,
      value: formatRuleValue(rule),
    };
  });
}

export function itemFiltersToEntries(
  item: DownloadEntry,
  fields: FilterField[],
  t: TFunc
): AppliedFilterEntry[] {
  const filterList = item.FilterList as { filter?: ApiFilterEntry[] } | undefined;
  const raw = Array.isArray(filterList?.filter) ? filterList!.filter : [];
  const fieldsById = new Map(fields.map((f) => [f.id.toLowerCase(), f]));
  return raw
    .filter((entry): entry is ApiFilterEntry & { field: string } => !!entry?.field)
    .map((entry) => {
      const field = fieldsById.get(entry.field.toLowerCase());
      const label = field ? t(field.labelKey, field.id) : entry.field;
      const v = entry.value;
      let value = '—';
      if (Array.isArray(v)) value = v.length > 0 ? v.join(', ') : '—';
      else if (v !== null && v !== undefined && String(v).length > 0) value = String(v);
      return { label, value };
    });
}
