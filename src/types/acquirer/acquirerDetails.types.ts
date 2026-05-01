export interface AcquirerMidEntry {
  ID: string;
  AcquirerID: string;
  AcquirerMID: string;
  IsRecurring: boolean;
  IsTokenised: boolean;
  Currency: string;
  Description: string;
  TransactionType: string;
  CreatedBy: string | null;
  CreatedAt: string;
  UpdatedBy: string | null;
  UpdatedAt: string;
  SubsidiaryID: string;
  IsActive: boolean;
  Password: string;
  UserName: string;
  TransactionOperation: string | null;
  IsDynamicMCC: boolean;
  GooglePayMerchantID: string;
  IsBlockRefund: boolean;
}

export interface AcquirerDetailsData {
  AcquirerName: string;
  AcquirerCode: string;
  TimeZone: string;
  URL1: string;
  CountryID: string;
  ChargebackInvestigationDays: number;
  RetrievalInvestigationDays: number;
  SettlementOffset: string;
  CreatedAt: string;
  UpdatedAt: string;
  Token: string;
  Sender: string;
  Channel: string;
  AcquirerID: string;
  AcquirerMID: AcquirerMidEntry;
  Status: string;
}

export interface AcquirerDetailsResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: AcquirerDetailsData;
}
