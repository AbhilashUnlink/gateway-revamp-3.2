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

export interface ColumnConfig {
  id: string;
  headerPrimaryKey: string;
  headerSecondaryKey?: string;
  cellType: CellType;
  width: number;
  accessorFn: (row: TransactionRow) => CellData;
}

export type TableFilter = {
  field: string;
  operator: string;
  value: string | number | boolean | string[];
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
