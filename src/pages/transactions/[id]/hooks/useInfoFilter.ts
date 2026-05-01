import { useCallback, useMemo, useState } from 'react';
import type { InfoFilter, InfoSectionConfig } from '../types';

interface UseInfoFilterResult {
  filter: InfoFilter;
  setFilter: (next: InfoFilter) => void;
  visibleSections: InfoSectionConfig[];
  layout: 'column' | 'grid';
  isAll: boolean;
}

export function useInfoFilter(sections: InfoSectionConfig[]): UseInfoFilterResult {
  const [filter, setFilterState] = useState<InfoFilter>('all');

  const setFilter = useCallback((next: InfoFilter) => setFilterState(next), []);

  const visibleSections = useMemo(
    () => (filter === 'all' ? sections : sections.filter((s) => s.id === filter)),
    [filter, sections]
  );

  const isAll = filter === 'all';
  const layout: 'column' | 'grid' = isAll ? 'column' : 'grid';

  return { filter, setFilter, visibleSections, layout, isAll };
}
