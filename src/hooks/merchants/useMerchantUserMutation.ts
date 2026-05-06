import { useCallback, useState } from 'react';
import { apiService } from '@/utils/apiService';
import type { MerchantUserFormValues } from '@/components/forms/merchants/MerchantUserForm';

export interface MerchantUserMutationPayload extends MerchantUserFormValues {
  /** Backend uses lowercased camel `merchantID`. */
  merchantID: string;
}

interface UseMerchantUserMutationResult {
  loading: boolean;
  error: string | null;
  /** Create a new user under the given merchant. */
  createUser: (payload: MerchantUserMutationPayload) => Promise<unknown>;
}

export function useMerchantUserMutation(onSuccess?: () => void): UseMerchantUserMutationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(
    async (payload: MerchantUserMutationPayload) => {
      setLoading(true);
      setError(null);
      try {
        const body = {
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          accessLevel: payload.accessLevel,
          status: payload.status,
          isChargebackNoificationEnabled: payload.isChargebackNoificationEnabled,
          isStatementNoificationEnabled: payload.isStatementNoificationEnabled,
          isEmergencyHolidayNoificationEnabled: payload.isEmergencyHolidayNoificationEnabled,
          isMonthlyHolidayNoificationEnabled: payload.isMonthlyHolidayNoificationEnabled,
          dasmid: payload.dasmid,
          groups: [null],
          merchantID: payload.merchantID,
        };
        const res = await apiService.entities.postUserManagementUserAdd(body);
        onSuccess?.();
        return res.data;
      } catch (e) {
        setError((e as Error).message ?? 'Failed to create user');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  return { loading, error, createUser };
}
