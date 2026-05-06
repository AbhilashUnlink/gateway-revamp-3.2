export interface MerchantIpApiRecord {
  ID: number;
  MerchantID: string;
  MerchantIP: string;
  Status: string;
  CreatedBy: string;
  UpdatedBy: string;
  CreatedAt: string;
  UpdatedAt: string;
  Comments: string;
}

export interface MerchantIpListApiResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: {
    total_count: number;
    records: MerchantIpApiRecord[];
  };
}

/** Flattened row used by the IP whitelist table. */
export interface MerchantIpRow {
  id: string;
  rawId: number;
  merchantId: string;
  ipAddress: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  comments: string;
}
