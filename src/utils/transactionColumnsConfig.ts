import { TRANSACTION_COLUMN_DISPLAY_NAMES } from '@/pages/transactions/transactionTableSchema';

/** Sentinel for the (built-in) default profile — not a backend uuid. */
export const TRANSACTION_DEFAULT_KEY = '__default__';

/** Display names that must always be visible and cannot be reordered. */
export const MANDATORY_FIELDS: readonly string[] = ['Transaction ID', 'Transaction Ref ID'];

/**
 * Display names that must NEVER appear in the column-preference picker
 * but are always rendered on the table itself. The user cannot reorder,
 * hide, or otherwise toggle these — they're invariants from the table's
 * point of view.
 */
export const HIDDEN_FIELDS: readonly string[] = ['Transaction Type', 'Currency'];

export interface ResolvedColumnsConfig {
  /** Column ids in the order they should appear. */
  orderedColumns: string[];
  /** Column ids that are hidden. */
  hiddenColumns: string[];
}

const ID_BY_DISPLAY_NAME: Record<string, string> = Object.entries(
  TRANSACTION_COLUMN_DISPLAY_NAMES
).reduce<Record<string, string>>((acc, [id, name]) => {
  acc[name] = id;
  return acc;
}, {});

const toColumnId = (token: string): string => ID_BY_DISPLAY_NAME[token] ?? token;

/** Mandatory column ids resolved from MANDATORY_FIELDS (display names). */
export const MANDATORY_COLUMN_IDS: ReadonlySet<string> = new Set(MANDATORY_FIELDS.map(toColumnId));

/** Hidden column ids resolved from HIDDEN_FIELDS (display names). */
export const HIDDEN_COLUMN_IDS: ReadonlySet<string> = new Set(HIDDEN_FIELDS.map(toColumnId));

/** Mandatory ids ordered by their position in MANDATORY_FIELDS, deduped. */
export const MANDATORY_COLUMN_IDS_ORDERED: readonly string[] = Array.from(
  new Set(MANDATORY_FIELDS.map(toColumnId))
);

/**
 * Strip columns flagged as picker-hidden from a list intended for the
 * column-preference popover. The table itself keeps them — only the picker
 * UI consumes the filtered list.
 */
export function filterHiddenColumns<T extends { id: string }>(columns: T[]): T[] {
  return columns.filter((c) => !HIDDEN_COLUMN_IDS.has(c.id));
}

/**
 * Resolve a saved profile's `columns_json` (display names) into table-ready
 * column state, layered with mandatory + picker-hidden invariants.
 *
 * - `columns_json` listed columns become the toggleable visible set, in order.
 * - Mandatory ids are pinned at the front and always visible.
 * - Picker-hidden ids (HIDDEN_COLUMN_IDS) are always visible on the table —
 *   they sit in their default position and are never reordered or toggled
 *   off, regardless of the saved profile.
 * - Any other canonical column not present in `columns_json` is hidden.
 */
export function getColumnsConfigFromColumnsJson(
  columnsJson: string[] | null | undefined,
  fallbackColumnIds: string[]
): ResolvedColumnsConfig {
  const allowedTail = fallbackColumnIds.filter(
    (id) => !MANDATORY_COLUMN_IDS.has(id) && !HIDDEN_COLUMN_IDS.has(id)
  );

  let orderedTail: string[];

  if (Array.isArray(columnsJson) && columnsJson.length > 0) {
    const requestedIds = columnsJson
      .filter((t): t is string => typeof t === 'string')
      .map(toColumnId);

    const seen = new Set<string>();
    orderedTail = [];
    for (const id of requestedIds) {
      if (HIDDEN_COLUMN_IDS.has(id) || MANDATORY_COLUMN_IDS.has(id) || seen.has(id)) continue;
      if (!fallbackColumnIds.includes(id)) continue;
      orderedTail.push(id);
      seen.add(id);
    }
  } else {
    // No saved profile → show every togglable column in its default order.
    orderedTail = allowedTail;
  }

  // Always-on (picker-hidden) columns sit right after the mandatory block so
  // they render no matter what the saved profile says.
  const alwaysOnIds = fallbackColumnIds.filter((id) => HIDDEN_COLUMN_IDS.has(id));
  const orderedColumns = [...MANDATORY_COLUMN_IDS_ORDERED, ...alwaysOnIds, ...orderedTail];
  const visibleSet = new Set(orderedColumns);
  const hiddenColumns = fallbackColumnIds.filter((id) => !visibleSet.has(id));

  return { orderedColumns, hiddenColumns };
}

/**
 * Build a backend `columns_json` payload (display names of visible columns,
 * in current order) from the popover's draft. Mandatory rows are always
 * included at the front.
 */
export function buildColumnsJsonFromDraft(
  draft: Array<{ id: string; displayName: string; visible: boolean }>
): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const item of draft) {
    if (HIDDEN_COLUMN_IDS.has(item.id)) continue;
    const isMandatory = MANDATORY_COLUMN_IDS.has(item.id);
    if (!isMandatory && !item.visible) continue;
    if (seen.has(item.id)) continue;
    out.push(item.displayName);
    seen.add(item.id);
  }
  return out;
}
