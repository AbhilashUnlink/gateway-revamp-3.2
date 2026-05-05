import {
  filterHiddenColumns,
  HIDDEN_COLUMN_IDS,
  MANDATORY_COLUMN_IDS,
  MANDATORY_COLUMN_IDS_ORDERED,
} from '@/utils/transactionColumnsConfig';
import type { ColumnDef, DraftItem } from './types';

export const isMandatoryId = (id: string) => MANDATORY_COLUMN_IDS.has(id);

export function buildDraft(
  columns: ColumnDef[],
  orderedIds: string[],
  hiddenIds: string[]
): DraftItem[] {
  const visibleColumns = filterHiddenColumns(columns);
  const byId = new Map(visibleColumns.map((c) => [c.id, c]));
  const hiddenSet = new Set(hiddenIds);
  const seen = new Set<string>();
  const tail: DraftItem[] = [];

  for (const id of orderedIds) {
    if (seen.has(id) || HIDDEN_COLUMN_IDS.has(id) || MANDATORY_COLUMN_IDS.has(id)) continue;
    const col = byId.get(id);
    if (!col) continue;
    tail.push({ ...col, visible: !hiddenSet.has(id) });
    seen.add(id);
  }
  for (const col of visibleColumns) {
    if (seen.has(col.id) || MANDATORY_COLUMN_IDS.has(col.id)) continue;
    tail.push({ ...col, visible: !hiddenSet.has(col.id) });
  }

  const mandatoryHead: DraftItem[] = [];
  for (const id of MANDATORY_COLUMN_IDS_ORDERED) {
    const col = byId.get(id);
    if (!col) continue;
    mandatoryHead.push({ ...col, visible: true });
  }
  return [...mandatoryHead, ...tail];
}
