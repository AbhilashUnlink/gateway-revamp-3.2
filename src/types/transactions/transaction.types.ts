export interface TransactionRow {
  id: string;
  transactionRefId: string;
  transactionId: string;
  transactionType: string;
  status: string;
  currency: string;
  amount: string;
  fee: string;
  transactionDate: string;
  updateDate: string;
  paymentScheme: string;
  paymentType: string;
  cardNumber: string;
  trackId: string;
  statementId: string;
  acquirer: string;
  acquirerMid: string;
  dasMid: string;
  authCode: string;
  productType: string;
  integrationMethod: string;
  integrationType: string;
  merchantAccount: string;
  merchantAccountEn: string;
  merchantRefId: string;
  subscriptionId: string;
  terminalId: string;
  terminalName: string;
  linkName: string;
}

export interface CellData {
  primary?: string;
  secondary?: string;
  tertiary?: string;
  status?: string;
  scheme?: string;
  copyable?: boolean;
  downloadable?: boolean;
}

export type CellType =
  | 'text'
  | 'multi'
  | 'status'
  | 'copy'
  | 'action'
  | 'date'
  | 'payment'
  | 'link-copy';

export type FilterAttributeType = 'text' | 'select' | 'multiSelect' | 'number' | 'dateRange';

export type GatewayConfigOptionKey =
  | 'merchantData'
  | 'dasmidOptions'
  | 'acquirers'
  | 'acquirerMIDData'
  | 'chargebackReasonCode'
  | 'businessLocations'
  | 'transactionTypes'
  | 'statuses'
  | 'paymentSchemes'
  | 'paymentTypes'
  | 'currencies';

/**
 * Per-attribute filter metadata. For columns that produce multiple values
 * (e.g. payment cell with `scheme`, `primary`, `secondary`), one entry per
 * accessor key. Each becomes its own flat filter field.
 */
export interface ColumnFilterAttribute {
  /** Backend field name AND filter id. */
  id: string;
  /** i18n key for the field label in the filter picker. */
  labelKey: string;
  /** Type of value control. */
  type: FilterAttributeType;
  /** Hide this attribute from the filter UI entirely. */
  hideFromFilter?: boolean;
  /** Pull options from a gatewayConfig key. */
  optionsFromConfig?: GatewayConfigOptionKey;
  /** Static options. */
  options?: { label: string; value: string }[];
}

export interface ColumnConfig {
  id: string;
  headerPrimaryKey: string;
  headerSecondaryKey?: string;
  cellType: CellType;
  width: number;
  accessorFn: (row: TransactionRow) => CellData;
  onPrimaryClick?: (row: TransactionRow) => void;
  /**
   * Pin this column to the left while the table scrolls horizontally. Only
   * the leading run of `sticky: true` columns is pinned — the first non-sticky
   * column ends the run, even if a later column is also marked sticky.
   */
  sticky?: boolean;
  /**
   * Filter attributes derived from this column. Always one per logical attribute
   * — no grouping. For a payment cell with three accessor keys, three entries.
   */
  filterAttributes?: ColumnFilterAttribute[];
}

export type TableFilter = {
  field: string;
  operator: string;
  value: string | number | boolean | string[];
  operand?: 'AND' | 'OR';
};

export interface TableApiPayload {
  StatsCurrency: string;
  take: number;
  skip: number;
  TimeZone: string;
  filter: TableFilter[];
}

export interface TransactionListParams {
  page: number;
  limit: number;
  statsCurrency?: string;
  timeZone?: string;
  filters?: TableFilter[];
}

export interface TransactionListResponse {
  data: unknown[];
  total: number;
  page: number;
  hasMore: boolean;
}
