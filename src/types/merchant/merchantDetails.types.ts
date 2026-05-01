export interface MerchantProductChild {
  TerminalName: string;
  TerminalId: string;
  LocationId: string;
}

export interface MerchantProduct {
  MCC: string;
  DASMID: string;
  V2DASMID: string;
  Location?: string;
  LocationID?: string;
  Name: string;
  TransactionCCY: string[];
  LegalName: string;
  LegalNameInEnglish: string;
  ProductID: string;
  Type: string;
  AcquirerCode: string;
  Status: string;
  DBA: string;
  OneTimeSetUpFee: string;
  MaintenanceFees: string;
  FraudMonitorFee: string;
  SettlementTransferFee: string;
  TransactionFee: string;
  BankFee: string;
  RefundFee: string;
  ChargebackFee: string;
  MinFeeAmt: string;
  MaxFeeAmt: string;
  RetrievalFee: string;
  BlendedMDR: string;
  MicroMDR: string;
  RollingReserve: string;
  RollingReserveHeld: string;
  MaintenanceFeeFrequency: string | null;
  children?: MerchantProductChild[];
}

export interface MerchantReseller {
  id: string;
  legalName: string;
  ctcFirstName: string;
  ctcLastName: string;
  ctcMiddleName: string;
  referralCode: string;
}

export interface MerchantDetailsData {
  LegalName: string;
  CurrentRefundBalance: string;
  CustomRefundBalance: string;
  LegalNameInEnglish: string;
  RegistrationNumber: string;
  SubsidiaryID: string;
  Address: string;
  City: string;
  PostalCode: string;
  Country: string;
  ContactFirstname: string;
  ContactLastname: string;
  ContactMiddleName: string;
  ContactEmail: string;
  ContactPhone: string;
  SecretKey: string;
  SecretKeyTest: string;
  MerchantID: string;
  DBA: string;
  Products: MerchantProduct[];
  Reseller: MerchantReseller | null;
}

export interface MerchantDetailsResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: MerchantDetailsData;
}
