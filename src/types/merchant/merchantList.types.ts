export interface MerchantProductSummary {
  Name: string;
}

export interface MerchantApiRecord {
  MerchantID: string;
  LegalName: string;
  LegalNameInEnglish: string;
  ContactEmail: string;
  CreatedAt: string;
  Country: string;
  SubsidiaryID: string;
  _count: number;
  IsMigrated: boolean;
  Products: MerchantProductSummary[];
  Status: string;
  ReferredCode: string;
  PartnerName: string;
}

export interface MerchantListApiResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: {
    total_count: number;
    records: MerchantApiRecord[];
  };
}

/** Flattened row shape used by the merchants table. */
export interface MerchantRow {
  id: string;
  merchantId: string;
  legalName: string;
  legalNameInEnglish: string;
  contactEmail: string;
  createdAt: string;
  country: string;
  subsidiaryId: string;
  productsCount: number;
  productNames: string[];
  status: string;
  partnerName: string;
  referredCode: string;
}

export interface MerchantListQuery {
  take: number;
  skip: number;
  TimeZone: string;
  /** Pre-serialized filter query string from `serializeForMerchants` (e.g. `?Country=HK`). */
  filterQs?: string;
}
