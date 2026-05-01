import { useEffect, useMemo, useRef } from 'react';
import { apiService } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  entityFetchFailure,
  entityFetchPending,
  entityFetchSuccess,
  selectProductEntry,
} from '@/store/slices/entityCacheSlice';
import type {
  ProductDetailsData,
  ProductDetailsResponse,
} from '@/types/product/productDetails.types';

interface UseProductDetailsParams {
  dasmid: string | null;
  terminalId: string | null;
}

interface UseProductDetailsResult {
  data: ProductDetailsData | null;
  loading: boolean;
  error: string | null;
}

const buildKey = (dasmid: string, terminalId: string) => `${dasmid}@@@${terminalId}`;

export function useProductDetails({
  dasmid,
  terminalId,
}: UseProductDetailsParams): UseProductDetailsResult {
  const dispatch = useAppDispatch();
  const cacheKey = dasmid && terminalId ? buildKey(dasmid, terminalId) : null;
  const entry = useAppSelector(selectProductEntry(cacheKey));

  const entryRef = useRef(entry);
  useEffect(() => {
    entryRef.current = entry;
  });

  useEffect(() => {
    if (!dasmid || !terminalId || !cacheKey) return;
    const current = entryRef.current;
    if (current.data || current.loading) return;

    dispatch(entityFetchPending({ kind: 'product', id: cacheKey }));

    apiService.entities
      .getProductByDASMIDTerminalID({ dasmid, terminalId })
      .then((res) => {
        const response = res as { data: ProductDetailsResponse };
        const data = response.data?.data ?? null;
        if (data) {
          dispatch(entityFetchSuccess({ kind: 'product', id: cacheKey, data }));
        } else {
          dispatch(
            entityFetchFailure({
              kind: 'product',
              id: cacheKey,
              error: 'No product data returned',
            })
          );
        }
      })
      .catch(() => {
        dispatch(
          entityFetchFailure({
            kind: 'product',
            id: cacheKey,
            error: 'Failed to load product details',
          })
        );
      });
  }, [dasmid, terminalId, cacheKey, dispatch]);

  return useMemo<UseProductDetailsResult>(() => {
    if (!cacheKey) return { data: null, loading: false, error: null };
    return {
      data: entry.data as ProductDetailsData | null,
      loading: entry.loading || (!entry.data && !entry.error),
      error: entry.error,
    };
  }, [cacheKey, entry]);
}
