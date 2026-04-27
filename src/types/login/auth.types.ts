export const USER_GROUPS = {
  FRAUD: 'FRAUD',
  RISK: 'RISK',
  RISK_COMPLIANCE: 'RISKCOMPLIANCE',
  COMPLIANCE: 'COMPLIANCE',
  OPERATIONS: 'OPERATIONS',
  SALES: 'SALES',
  SALES_OPS: 'SALESOPS',
  SUPPORT: 'SUPPORT',
  POS_SUPPORT: 'POSSUPPORT',
  SETTLEMENT: 'SETTLEMENT',
  SYSADMIN: 'SYSADMIN',
  PARTNERSHIP: 'PARTNERSHIP',
  FINANCE: 'FINANCE',
} as const;

export type UserGroup = (typeof USER_GROUPS)[keyof typeof USER_GROUPS];

export const SUBSIDIARIES = {
  SG: 'SG',
  RESELLER: 'RESELLER',
  JP: 'JP',
  MU: 'MU',
  EU: 'EU',
  HK: 'HK',
  CN: 'CN',
} as const;

export type Subsidiary = (typeof SUBSIDIARIES)[keyof typeof SUBSIDIARIES];

export interface SignInPayload {
  username: string;
  password: string;
}

export interface SignoutPayload {
  username: string;
  token: AuthToken;
}
export interface MfaGeneratePayload {
  Email: string;
  Password: string;
  path: 'DASPOS' | string;
}

export interface AuthToken {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

export interface SignInResponse {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: SignInData;
}

export interface SignInData {
  token: AuthToken;
  email: string;
  exp: number;
  uid: string;
  auth_time: number;
  Groups: UserGroup[];
  subsidiaries: Subsidiary[];
  name: string;
  appLevel: string;
  contactNo: string;
  referralCode: string;
  accessLevel: string;
  signInAsMerchant: boolean;
  passwordExpiry: string;
}

export type ApiResponse<T> = {
  statusCode: number;
  message: string;
  messageCode: string;
  success: boolean;
  data: T;
};

export interface LoginFormValues {
  username: string;
  password: string;
}

export interface MfaCheckResponse {
  IsMFA: number;
  IsMFAEnabled: number;
  QRCode?: string;
  PrivateKey?: string;
}
