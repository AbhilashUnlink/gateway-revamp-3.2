export type InfoSectionId =
  | 'transaction'
  | 'merchant'
  | 'payment'
  | 'subscription'
  | 'browser'
  | 'additional';

export type InfoFilter = 'all' | InfoSectionId;

export type BadgeTone = 'success' | 'error' | 'neutral';

export interface InfoFieldBadge {
  label: string;
  tone: Exclude<BadgeTone, 'error'>;
}

export interface InfoFieldConfig {
  label: string;
  value?: string | number | null;
  copyable?: boolean;
  downloadable?: boolean;
  badge?: InfoFieldBadge;
}

export interface InfoSectionConfig {
  id: InfoSectionId;
  titleKey: string;
  fields: InfoFieldConfig[];
}

export interface LifecycleSummary {
  lifecycleLabel: string;
  balanceLabel: string | null;
}

export type TransactionActionType = 'refund' | 'capture' | 'void' | 'dispute' | 'edit-status';

export interface AuditEntry {
  UpdatedBy?: string;
  updatedBy?: string;
  CreatedBy?: string;
  UpdatedAt?: string;
  updatedAt?: string;
  CreatedAt?: string;
  AuthCode?: string;
  authCode?: string;
  Description?: string;
  description?: string;
  Comment?: string;
  Status?: string;
  status?: string;
  [key: string]: unknown;
}

export interface TokenizedItem {
  uuid?: string;
  trackid?: string | null;
  TransactionRefID?: string;
  amount?: number | string;
  CurrencyCode?: string;
  status?: string;
  Status?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
  [key: string]: unknown;
}
