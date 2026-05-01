import { useCallback, useMemo } from 'react';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';
import type { TransactionActionType } from '../types';

export function useTransactionDrawerActions(data: TransactionDetailsData | null) {
  const { open } = useDrawerControl();

  const drawerData = useMemo(() => {
    if (!data) return null;
    return {
      transactionRefId: data.TransactionRefID,
      transactionId: String(data.TransactionID),
      originalAmount: data.Amount,
      remainingAmount: data.Amount,
      currency: data.CurrencyCode,
    };
  }, [data]);

  const onAction = useCallback(
    (type: TransactionActionType) => {
      if (!drawerData) return;
      open({ type, data: drawerData });
    },
    [open, drawerData]
  );

  return { onAction };
}
