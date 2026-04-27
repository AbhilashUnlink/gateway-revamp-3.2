export interface TransactionApiRecord {
  'Transaction ID'?: string;
  'Transaction Ref ID'?: string;
  'Transaction Type'?: string;
  Status?: string;
  Currency?: string;
  Amount?: string;
  Fees?: string;
  'Transaction Date'?: string;
  'Updated Date'?: string;
  Scheme?: string;
  'Payment Type'?: string;
  'Card Number'?: string;
  'Track ID'?: string;
  'Statement ID'?: string;
  Acquirer?: string;
  'Acquirer MID'?: string;
  DASMID?: string;
  'Auth Code'?: string;
  'Product Type'?: string;
  'Integration Method'?: string;
  'Integration Type'?: string;
  'Merchant Account'?: string;
  'Merchant Account (English)'?: string;
  'Merchant Ref ID'?: string;
  'Subscription ID'?: string;
  'Terminal ID'?: string;
  'Terminal Name'?: string;
  'Link Name'?: string;
}

export interface TransactionListData {
  records: string;
  total_count?: number;
  hasMore?: boolean;
  total_amount?: string;
  approval_ratio?: string;
  currency?: string;
  decline_count?: string;
  total_refund?: string;
  total_sales?: string;
}

export interface TransactionListApiResponse {
  data?: TransactionListData;
}
