export interface MerchantUserApiRecord {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  groups: string[];
  dasmid: string[];
  accessLevel: string;
  enableNotification: boolean;
  status: string;
  createdDate: string;
  lastLogin: string | null;
  isChargebackNoificationEnabled?: boolean;
  isStatementNoificationEnabled?: boolean;
  isHelpSupportNoificationEnabled?: boolean;
  isEmergencyHolidayNoificationEnabled?: boolean;
  isMonthlyHolidayNoificationEnabled?: boolean;
}

export interface MerchantUserListApiResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: {
    total_count: number;
    records: MerchantUserApiRecord[];
  };
}

/** Flattened row shape used by the user-management table. */
export interface MerchantUserRow {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  productsCount: number;
  dasmids: string[];
  role: string;
  joiningDate: string;
  isChargebackNoificationEnabled: boolean;
  isStatementNoificationEnabled: boolean;
  isEmergencyHolidayNoificationEnabled: boolean;
  isMonthlyHolidayNoificationEnabled: boolean;
}
