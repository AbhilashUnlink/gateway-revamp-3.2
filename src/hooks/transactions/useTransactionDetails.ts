import { useState, useEffect } from 'react';
import { apiService } from '@/utils';
import type {
  TransactionDetailsData,
  TransactionDetailsResponse,
} from '@/types/transactions/transactionDetails.types';

export function useTransactionDetails(id: string | null) {
  const [data, setData] = useState<TransactionDetailsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setError(null);
        setLoading(true);

        const res = await apiService.transactions.getById({ id });
        const response = res as { data: TransactionDetailsResponse };

        setData(response.data.data);
      } catch {
        setError('Failed to load transaction details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { data, loading, error };
}
