import { useEffect, useMemo, useRef } from 'react';
import { apiService } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  entityFetchFailure,
  entityFetchPending,
  entityFetchSuccess,
  selectMerchantEntry,
} from '@/store/slices/entityCacheSlice';
import type {
  MerchantDetailsData,
  MerchantDetailsResponse,
} from '@/types/merchant/merchantDetails.types';

interface UseMerchantDetailsResult {
  data: MerchantDetailsData | null;
  loading: boolean;
  error: string | null;
}

export function useMerchantDetails(merchantId: string | null): UseMerchantDetailsResult {
  const dispatch = useAppDispatch();
  const entry = useAppSelector(selectMerchantEntry(merchantId));

  const entryRef = useRef(entry);
  useEffect(() => {
    entryRef.current = entry;
  });

  useEffect(() => {
    if (!merchantId) return;
    const current = entryRef.current;
    if (current.data || current.loading) return;

    dispatch(entityFetchPending({ kind: 'merchant', id: merchantId }));

    apiService.entities
      .getMerchantById({ merchantId })
      .then((res) => {
        const response = res as { data: MerchantDetailsResponse };
        const data = response.data?.data ?? null;
        if (data) {
          dispatch(entityFetchSuccess({ kind: 'merchant', id: merchantId, data }));
        } else {
          dispatch(
            entityFetchFailure({
              kind: 'merchant',
              id: merchantId,
              error: 'No merchant data returned',
            })
          );
        }
      })
      .catch(() => {
        dispatch(
          entityFetchFailure({
            kind: 'merchant',
            id: merchantId,
            error: 'Failed to load merchant details',
          })
        );
      });
  }, [merchantId, dispatch]);

  return useMemo<UseMerchantDetailsResult>(() => {
    if (!merchantId) return { data: null, loading: false, error: null };
    return {
      data: entry.data as MerchantDetailsData | null,
      loading: entry.loading || (!entry.data && !entry.error),
      error: entry.error,
    };
  }, [merchantId, entry]);
}
