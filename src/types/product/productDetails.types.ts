export interface ProductTransactionTypeFlags {
  has3DS: boolean;
  hasCVC: boolean;
  hasRecurring: boolean;
  hasTokenised: boolean;
  hasDynamicMCC: boolean;
}

export interface ProductSchemeFlags {
  hasVISA: boolean;
  hasMastercard: boolean;
  hasJCB: boolean;
  hasAmex: boolean;
  hasUnionPay: boolean;
  hasAlipay: boolean;
  hasApplePay: boolean;
  hasGooglePay: boolean;
  hasDinersClub: boolean;
  hasGCash: boolean;
  hasPayPay: boolean;
  hasKonbini: boolean;
  hasPayEasy: boolean;
}

export interface ProductConnectionMethodFlags {
  hasMobileApp: boolean;
  hasShopPlugin: boolean;
}

export interface ProductDetailsData {
  ProductID: string;
  ProductName: string;
  ProductStatus: string;
  MerchantName: string;
  MerchantNameInEnglish: string;
  ProductType: string;
  DASMID: string;
  V2DASMID: string;
  ShopProcessingURL: string;
  MerchantCategoryCode: string;
  StaticDescriptor: string;
  Currency: string;
  TransactionCCY: string[];
  SettlementCCY: string;
  ApplePayMID: string;
  GooglePayMID: string;
  RecurringACQMID: string;
  GCashMID: string;
  PayPayMID: string;
  KonbiniMID: string;
  PayEasyMID: string;
  BillingDescriptor: string;
  MerchantID: string;
  ReferredCode: string;
  AcquirerCode: string;
  TerminalID: string;
  TerminalName: string;
  LocationID: string;
  LocationName: string;
  TransactionType: ProductTransactionTypeFlags;
  SchemeTypes: ProductSchemeFlags;
  ConnectionMethods: ProductConnectionMethodFlags;
  MerchantLogoURL: string;
  AcquirerMID: string;
}

export interface ProductDetailsResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: ProductDetailsData;
}
