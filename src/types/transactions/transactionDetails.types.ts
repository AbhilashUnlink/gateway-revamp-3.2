export interface TransactionHistoryItem {
  uuid: string;
  trackid: string | null;
  event: string;
  TransactionType: string;
  amount: number;
  status: string;
  ResponseCodeID: number;
  CreatedAt: string;
  CurrencyCode: string;
  Isrecurring: boolean;
}

export interface SubscriptionDetails {
  SubscriptionID?: string;
  Plan?: string;
  BillingCycle?: string;
  NextBilling?: string;
  CycleBilled?: string;
  Status?: string;
}

export interface TransactionDetailsData {
  TransactionRefID: string;
  V2UUID: string | null;
  MerchantID: string;
  Isrecurring: boolean;
  TransactionType: string;
  Date: string;
  UpdatedDate: string;
  Amount: number;
  DASMID: string;
  CurrencyCode: string;
  Response: number;
  trackID: string;
  Status: string;
  AuthCode: string | null;
  CardHolder: string;
  CVVResponse: string;
  ExpiryDate: string;
  Memo: string | null;
  AcquirerReferenceNumber: string;
  Scheme: string;
  TransactionID: number;
  CardNumber: string;
  EmailAddress: string;
  Phone: string;
  BillingPostcode: string;
  BillingCountry: string;
  BillingAddress: string;
  BillingCity: string;
  ShippingAddress: string;
  ShippingCountry: string;
  ShippingCity: string;
  ShippingPostcode: string;
  CustomerIP: string;
  MerchantIP: string;
  AcquirerCode: string;
  AcquirerMID: string;
  AcquirerID: string;
  IsBlockRefund: boolean;
  Event: string;
  ACQError: string;
  GatewayError: string;
  BIN: number;
  IssuingBank: string;
  IssuingCountry: string;
  MerchantRefNumber: string;
  TransactionTimezone: string;
  HashCardNumber: string;
  RequestID: string;
  TerminalID: string;
  TerminalName: string;
  PBLLinkName: string | null;
  browser_info: unknown;
  MerchantCategoryCode: string;
  ProductType: string;
  Merchant: string;
  Referenceremark: string;
  LegalNameInEnglish: string;
  SecretKey: string;
  TransactionLog: unknown[];
  TokenizedTransactionHistory: unknown[];
  ProductDetails: unknown[];
  SubscriptionDetails: SubscriptionDetails | null;
  PaymentType: string;
  AcquirerResponse: unknown[];
  PrimaryAddress: unknown;
  ThreeDSecureInfo: unknown | null;
  TransactionHistory: TransactionHistoryItem[];
}

export interface TransactionDetailsResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: TransactionDetailsData;
}
