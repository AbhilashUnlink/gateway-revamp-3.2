import { useCallback, useState } from 'react';
import { apiService } from '@/utils/apiService';
import type { MerchantIpFormValues } from '@/components/forms/merchants/MerchantIpForm';

export interface MerchantIpMutationPayload extends MerchantIpFormValues {
  merchantId: string;
}

interface UseMerchantIpMutationResult {
  loading: boolean;
  error: string | null;
  createIp: (payload: MerchantIpMutationPayload) => Promise<unknown>;
  updateIp: (payload: MerchantIpMutationPayload) => Promise<unknown>;
  deleteIp: (id: number | string) => Promise<unknown>;
}

/**
 * Backend uses ONE endpoint for both create and update — the `insert` flag
 * differentiates them: omit (or `"1"`) for create, `"0"` for update.
 */
function toBody(payload: MerchantIpMutationPayload, mode: 'create' | 'update') {
  return {
    MerchantIP: payload.ipAddress,
    Comments: payload.comments,
    Status: payload.status,
    MerchantID: payload.merchantId,
    ...(mode === 'update' ? { insert: '0' } : {}),
  };
}

export function useMerchantIpMutation(onSuccess?: () => void): UseMerchantIpMutationResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createIp = useCallback(
    async (payload: MerchantIpMutationPayload) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.entities.postMerchantMerchantIp(toBody(payload, 'create'));
        onSuccess?.();
        return res.data;
      } catch (e) {
        setError((e as Error).message ?? 'Failed to create merchant IP');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  const updateIp = useCallback(
    async (payload: MerchantIpMutationPayload) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.entities.postMerchantMerchantIp(toBody(payload, 'update'));
        onSuccess?.();
        return res.data;
      } catch (e) {
        setError((e as Error).message ?? 'Failed to update merchant IP');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  const deleteIp = useCallback(
    async (id: number | string) => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiService.entities.deleteMerchantMerchantIp({ id });
        onSuccess?.();
        return res.data;
      } catch (e) {
        setError((e as Error).message ?? 'Failed to delete merchant IP');
        throw e;
      } finally {
        setLoading(false);
      }
    },
    [onSuccess]
  );

  return { loading, error, createIp, updateIp, deleteIp };
}
