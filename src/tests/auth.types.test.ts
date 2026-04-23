import { describe, it, expect } from 'vitest';
import {
  USER_GROUPS,
  SUBSIDIARIES,
  type SignInData,
  type SignInResponse,
} from '@/types/login/auth.types';

describe('USER_GROUPS', () => {
  it('contains expected group values', () => {
    expect(USER_GROUPS.FRAUD).toBe('FRAUD');
    expect(USER_GROUPS.RISK_COMPLIANCE).toBe('RISKCOMPLIANCE');
    expect(USER_GROUPS.SALES_OPS).toBe('SALESOPS');
    expect(USER_GROUPS.POS_SUPPORT).toBe('POSSUPPORT');
    expect(USER_GROUPS.SYSADMIN).toBe('SYSADMIN');
  });

  it('has all required groups', () => {
    const keys = Object.keys(USER_GROUPS);
    expect(keys).toContain('FRAUD');
    expect(keys).toContain('RISK');
    expect(keys).toContain('COMPLIANCE');
    expect(keys).toContain('OPERATIONS');
    expect(keys).toContain('FINANCE');
  });
});

describe('SUBSIDIARIES', () => {
  it('contains expected subsidiary values', () => {
    expect(SUBSIDIARIES.SG).toBe('SG');
    expect(SUBSIDIARIES.EU).toBe('EU');
    expect(SUBSIDIARIES.JP).toBe('JP');
    expect(SUBSIDIARIES.HK).toBe('HK');
    expect(SUBSIDIARIES.CN).toBe('CN');
  });

  it('has all required subsidiaries', () => {
    const keys = Object.keys(SUBSIDIARIES);
    expect(keys).toContain('SG');
    expect(keys).toContain('RESELLER');
    expect(keys).toContain('MU');
  });
});

describe('SignInResponse shape', () => {
  const mockSignInData: SignInData = {
    token: {
      accessToken: 'access_token_value',
      idToken: 'id_token_value',
      refreshToken: 'refresh_token_value',
    },
    email: 'user@example.com',
    exp: 1700000000,
    uid: 'user-uid-123',
    auth_time: 1699990000,
    Groups: [USER_GROUPS.SALES, USER_GROUPS.FINANCE],
    subsidiaries: [SUBSIDIARIES.SG, SUBSIDIARIES.EU],
    name: 'Test User',
    appLevel: '1',
    contactNo: '+6512345678',
    referralCode: 'REF123',
    accessLevel: 'standard',
    signInAsMerchant: false,
    passwordExpiry: '2025-12-31',
  };

  const mockResponse: SignInResponse = {
    statusCode: 200,
    message: 'Success',
    messageCode: 'LOGIN_SUCCESS',
    success: true,
    data: mockSignInData,
  };

  it('has correct token structure', () => {
    expect(mockResponse.data.token.accessToken).toBe('access_token_value');
    expect(mockResponse.data.token.idToken).toBe('id_token_value');
    expect(mockResponse.data.token.refreshToken).toBe('refresh_token_value');
  });

  it('has typed Groups array', () => {
    expect(mockResponse.data.Groups).toContain(USER_GROUPS.SALES);
    expect(mockResponse.data.Groups).toContain(USER_GROUPS.FINANCE);
    expect(mockResponse.data.Groups).toHaveLength(2);
  });

  it('has typed subsidiaries array', () => {
    expect(mockResponse.data.subsidiaries).toContain(SUBSIDIARIES.SG);
    expect(mockResponse.data.subsidiaries).toContain(SUBSIDIARIES.EU);
    expect(mockResponse.data.subsidiaries).toHaveLength(2);
  });

  it('has correct response metadata', () => {
    expect(mockResponse.statusCode).toBe(200);
    expect(mockResponse.success).toBe(true);
  });

  // Type safety: the lines below would cause a TypeScript compile error if uncommented
  // mockSignInData.Groups = ['INVALID_GROUP'];       // TS error: not assignable to UserGroup[]
  // mockSignInData.subsidiaries = ['UNKNOWN'];       // TS error: not assignable to Subsidiary[]
});
