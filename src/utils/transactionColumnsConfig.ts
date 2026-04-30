import { TRANSACTION_COLUMN_DISPLAY_NAMES } from '@/pages/transactions/transactionTableSchema';

export const TRANSACTION_DEFAULT_KEY = 'default';

/** Display names that must always be visible and cannot be reordered. */
export const MANDATORY_FIELDS: readonly string[] = ['Transaction ID', 'Transaction Ref ID'];

/** Display names that must never appear in the picker or table. */
export const HIDDEN_FIELDS: readonly string[] = ['Transaction Type', 'Currency'];

export interface TransactionListEntry {
  /** Backend uuid (set after a successful create — drives subsequent updates). */
  uuid?: string;
  order?: string[];
  unChecked?: string[];
  updatedList?: Array<{ headerName?: string; id?: string }>;
  [extra: string]: unknown;
}

export interface TransactionListBlob {
  list?: Record<string, TransactionListEntry>;
  selected?: string;
}

export interface ResolvedColumnsConfig {
  /** Column ids in the order they should appear. */
  orderedColumns: string[];
  /** Column ids that are hidden. */
  hiddenColumns: string[];
  /** Optional metadata override per column id (e.g. backend headerName). */
  columnMetaMap: Record<string, { headerName: string }>;
}

const EMPTY_BLOB: TransactionListBlob = {};

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

/** Filter a canonical column list, dropping anything in HIDDEN_FIELDS. */
export function filterHiddenColumns<T extends { id: string }>(columns: T[]): T[] {
  return columns.filter((c) => !HIDDEN_COLUMN_IDS.has(c.id));
}

export function getTransactionListBlob(userPreference: unknown): TransactionListBlob {
  if (!userPreference || typeof userPreference !== 'object') return EMPTY_BLOB;
  const tl = (userPreference as Record<string, unknown>).transactionList;
  if (!tl || typeof tl !== 'object') return EMPTY_BLOB;
  return tl as TransactionListBlob;
}

export function resolveSelectedKey(blob: TransactionListBlob): string {
  const list = blob.list ?? {};
  const sel = blob.selected;
  if (sel && Object.prototype.hasOwnProperty.call(list, sel)) return sel;
  if (Object.prototype.hasOwnProperty.call(list, TRANSACTION_DEFAULT_KEY)) {
    return TRANSACTION_DEFAULT_KEY;
  }
  const keys = Object.keys(list);
  return keys[0] ?? TRANSACTION_DEFAULT_KEY;
}

/**
 * Resolve a transactionList entry into table-ready column state.
 *
 * Precedence for ordering:
 *   1. `updatedList` (`{ id, headerName }[]`) when present and non-empty
 *   2. `order` (column ids or display names)
 *   3. `fallbackColumnIds` — caller's default order
 *
 * Tokens in `order` / `unChecked` may be either column ids OR backend display
 * names; both are accepted.
 */
export function getTransactionColumnsConfig(
  userPreference: unknown,
  selectedKey?: string,
  fallbackColumnIds: string[] = []
): ResolvedColumnsConfig {
  const blob = getTransactionListBlob(userPreference);
  const key = selectedKey ?? resolveSelectedKey(blob);
  const entry = blob.list?.[key] ?? {};

  const columnMetaMap: Record<string, { headerName: string }> = {};
  if (Array.isArray(entry.updatedList)) {
    for (const item of entry.updatedList) {
      if (!item || typeof item !== 'object') continue;
      const id = typeof item.id === 'string' ? item.id : undefined;
      const headerName = typeof item.headerName === 'string' ? item.headerName : undefined;
      if (id && headerName) columnMetaMap[id] = { headerName };
    }
  }

  let orderedColumns: string[] = [];
  if (Array.isArray(entry.updatedList) && entry.updatedList.length > 0) {
    for (const item of entry.updatedList) {
      const id = item && typeof item === 'object' ? (item as { id?: unknown }).id : undefined;
      if (typeof id === 'string') orderedColumns.push(id);
    }
  } else if (Array.isArray(entry.order) && entry.order.length > 0) {
    orderedColumns = entry.order.filter((t): t is string => typeof t === 'string').map(toColumnId);
  } else {
    orderedColumns = [...fallbackColumnIds];
  }

  let hiddenColumns: string[] = Array.isArray(entry.unChecked)
    ? entry.unChecked.filter((t): t is string => typeof t === 'string').map(toColumnId)
    : [];

  // Mandatory ids are always visible; hidden ids are always hidden.
  hiddenColumns = hiddenColumns.filter(
    (id) => !MANDATORY_COLUMN_IDS.has(id) && !HIDDEN_COLUMN_IDS.has(id)
  );
  for (const id of HIDDEN_COLUMN_IDS) hiddenColumns.push(id);

  // Strip hidden + dedupe; pin mandatory at the front in canonical order.
  const seenOrder = new Set<string>();
  const tail: string[] = [];
  for (const id of orderedColumns) {
    if (HIDDEN_COLUMN_IDS.has(id) || MANDATORY_COLUMN_IDS.has(id) || seenOrder.has(id)) continue;
    tail.push(id);
    seenOrder.add(id);
  }
  orderedColumns = [...MANDATORY_COLUMN_IDS_ORDERED, ...tail];

  return { orderedColumns, hiddenColumns, columnMetaMap };
}

/**
 * Build a transactionList entry for persistence from the popover's draft.
 * Mirrors the legacy backend shape (`order`, `unChecked`, `updatedList`).
 */
export function buildTransactionListEntry(
  draft: Array<{ id: string; displayName: string; visible: boolean }>,
  extras: Record<string, unknown> = {}
): TransactionListEntry {
  const visible = draft.filter((c) => c.visible);
  return {
    order: draft.map((c) => c.id),
    unChecked: draft.filter((c) => !c.visible).map((c) => c.id),
    updatedList: visible.map((c) => ({ id: c.id, headerName: c.displayName })),
    ...extras,
  };
}
