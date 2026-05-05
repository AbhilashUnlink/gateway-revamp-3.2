import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { DraftItem } from './types';

/**
 * Filters the draft list by the user's search query while preserving each
 * item's original index — drag-and-drop relies on indices into the full
 * draft, so the filtered slice carries them along.
 */
export function useDraftSearch(draft: DraftItem[], searchQuery: string) {
  const { t } = useTranslation();
  const indexedDraft = useMemo(() => draft.map((item, idx) => ({ item, idx })), [draft]);
  return useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return indexedDraft;
    return indexedDraft.filter(
      ({ item }) =>
        t(item.labelKey, item.displayName).toLowerCase().includes(q) ||
        item.displayName.toLowerCase().includes(q)
    );
  }, [indexedDraft, searchQuery, t]);
}
