import { useAppSelector } from '@/store/hooks';
import {
  selectTransactionDetailsData,
  selectTransactionDetailsLoading,
  selectTransactionDetailsError,
  selectTransactionActions,
  type TransactionActionsVisibility,
} from '@/store/slices/transactionDetailsSlice';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

interface UseTransactionActionsResult extends TransactionActionsVisibility {
  data: TransactionDetailsData | null;
  loading: boolean;
  error: string | null;
}

export function useTransactionActions(): UseTransactionActionsResult {
  const data = useAppSelector(selectTransactionDetailsData);
  const loading = useAppSelector(selectTransactionDetailsLoading);
  const error = useAppSelector(selectTransactionDetailsError);
  const actions = useAppSelector(selectTransactionActions);
  return { data, loading, error, ...actions };
}
