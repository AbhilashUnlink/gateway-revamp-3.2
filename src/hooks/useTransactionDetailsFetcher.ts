import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTransactionDetails } from '@/store/thunks/transactionDetailsThunks';
import {
  selectTransactionDetailsCurrentId,
  selectTransactionDetailsLoading,
} from '@/store/slices/transactionDetailsSlice';

const TRIGGER_DRAWERS = new Set(['details', 'refund', 'capture', 'void', 'dispute', 'edit-status']);

export function useTransactionDetailsFetcher() {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const currentId = useAppSelector(selectTransactionDetailsCurrentId);
  const loading = useAppSelector(selectTransactionDetailsLoading);

  const id = searchParams.get('id');
  const drawerList = (searchParams.get('drawer') ?? '').split(',').filter(Boolean);
  const shouldFetch = !!id && drawerList.some((d) => TRIGGER_DRAWERS.has(d));

  useEffect(() => {
    if (!shouldFetch || !id) return;
    if (loading) return;
    if (currentId === id) return;
    void dispatch(fetchTransactionDetails({ id }));
  }, [shouldFetch, id, loading, currentId, dispatch]);
}
