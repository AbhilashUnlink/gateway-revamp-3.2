export interface ColumnDef {
  id: string;
  /** Backend display name (round-trips to/from `columns_json`/`updatedList`). */
  displayName: string;
  /** UI label (i18n key) for the right-pane checklist. */
  labelKey: string;
}

export interface DraftItem {
  id: string;
  displayName: string;
  labelKey: string;
  visible: boolean;
}
