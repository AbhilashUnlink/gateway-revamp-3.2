import { useMemo } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectColumnPreference } from '@/store/slices/columnPreferencesSlice';

interface IdHaving {
  id: string;
}

/**
 * Apply a screen's saved column preference (order + hidden) to the default
 * column list and return the visible, ordered columns ready to feed the table.
 *
 * - `order`: ids in priority sequence. Anything missing falls back to its
 *   original index in `defaultColumns`.
 * - `hidden`: ids to filter out entirely.
 *
 * Generic so any table on any screen can opt in.
 */
export function useColumnPreferences<T extends IdHaving>(screen: string, defaultColumns: T[]): T[] {
  const pref = useAppSelector(selectColumnPreference(screen));

  return useMemo(() => {
    const byId = new Map(defaultColumns.map((c) => [c.id, c]));
    const hiddenSet = new Set(pref.hidden);

    if (pref.order.length === 0) {
      return defaultColumns.filter((c) => !hiddenSet.has(c.id));
    }

    const seen = new Set<string>();
    const ordered: T[] = [];

    for (const id of pref.order) {
      if (seen.has(id) || hiddenSet.has(id)) continue;
      const col = byId.get(id);
      if (!col) continue;
      ordered.push(col);
      seen.add(id);
    }

    // Append any default columns that weren't covered by `order` and aren't hidden.
    for (const col of defaultColumns) {
      if (seen.has(col.id) || hiddenSet.has(col.id)) continue;
      ordered.push(col);
    }

    return ordered;
  }, [defaultColumns, pref.order, pref.hidden]);
}
