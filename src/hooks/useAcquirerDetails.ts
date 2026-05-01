import { useEffect, useMemo, useRef } from 'react';
import { apiService } from '@/utils';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  entityFetchFailure,
  entityFetchPending,
  entityFetchSuccess,
  selectAcquirerEntry,
} from '@/store/slices/entityCacheSlice';
import type {
  AcquirerDetailsData,
  AcquirerDetailsResponse,
} from '@/types/acquirer/acquirerDetails.types';

interface UseAcquirerDetailsResult {
  data: AcquirerDetailsData | null;
  loading: boolean;
  error: string | null;
}

export function useAcquirerDetails(acquirerMid: string | null): UseAcquirerDetailsResult {
  const dispatch = useAppDispatch();
  const entry = useAppSelector(selectAcquirerEntry(acquirerMid));

  const entryRef = useRef(entry);
  useEffect(() => {
    entryRef.current = entry;
  });

  useEffect(() => {
    if (!acquirerMid) return;
    const current = entryRef.current;
    if (current.data || current.loading) return;

    dispatch(entityFetchPending({ kind: 'acquirer', id: acquirerMid }));

    apiService.acquirers
      .getByAcquirerMid({ acquirerMid })
      .then((res) => {
        const response = res as { data: AcquirerDetailsResponse };
        const data = response.data?.data ?? null;
        if (data) {
          dispatch(entityFetchSuccess({ kind: 'acquirer', id: acquirerMid, data }));
        } else {
          dispatch(
            entityFetchFailure({
              kind: 'acquirer',
              id: acquirerMid,
              error: 'No acquirer data returned',
            })
          );
        }
      })
      .catch(() => {
        dispatch(
          entityFetchFailure({
            kind: 'acquirer',
            id: acquirerMid,
            error: 'Failed to load acquirer details',
          })
        );
      });
  }, [acquirerMid, dispatch]);

  return useMemo<UseAcquirerDetailsResult>(() => {
    if (!acquirerMid) return { data: null, loading: false, error: null };
    return {
      data: entry.data as AcquirerDetailsData | null,
      loading: entry.loading || (!entry.data && !entry.error),
      error: entry.error,
    };
  }, [acquirerMid, entry]);
}
