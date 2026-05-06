import type { ColumnConfig } from '@/types/transactions/transaction.types';
import type { FilterField } from './types';

/**
 * Flatten table column configs into a list of filter fields.
 *
 * Rules:
 * - Each `ColumnConfig.filterAttributes` entry produces ONE flat filter field.
 *   No grouping under the column id.
 * - Attributes with `hideFromFilter: true` are skipped.
 * - Filter-only synthetic fields (e.g. amount range, transaction event) can be
 *   appended via the `extras` arg.
 */
export function buildFilterFields<TRow = unknown>(
  columns: ColumnConfig<TRow>[],
  extras: FilterField[] = []
): FilterField[] {
  const fromColumns: FilterField[] = [];

  for (const col of columns) {
    const attrs = col.filterAttributes;
    if (!attrs?.length) continue;
    for (const attr of attrs) {
      if (attr.hideFromFilter) continue;
      fromColumns.push({
        id: attr.id,
        labelKey: attr.labelKey,
        type: attr.type,
        optionsFromConfig: attr.optionsFromConfig,
        options: attr.options,
      });
    }
  }

  // Dedupe by id (column-level duplicates win first occurrence; extras append).
  const seen = new Set<string>();
  const merged: FilterField[] = [];
  for (const f of [...fromColumns, ...extras]) {
    if (seen.has(f.id)) continue;
    seen.add(f.id);
    merged.push(f);
  }
  return merged;
}
