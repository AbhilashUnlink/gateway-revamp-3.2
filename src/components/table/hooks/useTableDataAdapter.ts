import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTransactionsList } from '@/store/thunks/transactionsThunks';
import { resetTransactions } from '@/store/slices/transactionsSlice';
import type { TableFilter, TransactionListParams } from '@/types/transactions/transaction.types';

const PAGE_SIZE = 10;

export function useTableDataAdapter(filters?: TableFilter[], statsCurrency?: string) {
  const dispatch = useAppDispatch();
  const { rows, page, hasMore, loading, error, stats } = useAppSelector(
    (state) => state.transactions
  );

  const load = useCallback(
    (pageNumber: number) => {
      const params: TransactionListParams = {
        page: pageNumber,
        limit: PAGE_SIZE,
        filters,
        statsCurrency,
      };
      dispatch(fetchTransactionsList(params));
    },
    [dispatch, filters, statsCurrency]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) load(page);
  }, [loading, hasMore, load, page]);

  const refresh = useCallback(() => {
    dispatch(resetTransactions());
    load(1);
  }, [dispatch, load]);

  return { rows, loading, hasMore, error, stats, loadMore, refresh };
}
