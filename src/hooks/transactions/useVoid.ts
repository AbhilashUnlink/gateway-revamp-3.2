import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '@/utils';
import { useToast } from '@/hooks/useToast';
import { useAppDispatch } from '@/store/hooks';
import { bumpRefreshCount } from '@/store/slices/transactionsSlice';

interface VoidPayload {
  id: string;
  merchant_id: string;
}

export function useVoid(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useAppDispatch();

  const submitVoid = async (headers: Record<string, string>, payload: VoidPayload) => {
    setLoading(true);
    try {
      await apiService.transactions.postVoid(headers, payload);
      toast.success(t('drawer.void_success'));
      dispatch(bumpRefreshCount());
      onSuccess?.();
    } catch (err) {
      const axiosMessage = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      toast.error(axiosMessage ?? t('drawer.void_error'));
    } finally {
      setLoading(false);
    }
  };

  return { submitVoid, loading };
}
