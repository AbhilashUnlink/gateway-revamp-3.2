import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '@/utils';
import { useToast } from '@/hooks/useToast';
import { useAppDispatch } from '@/store/hooks';
import { bumpRefreshCount } from '@/store/slices/transactionsSlice';

interface CapturePayload {
  id: string;
  captureAmount: number;
  notes: string;
  merchant_id: string;
}

export function useCapture(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();
  const dispatch = useAppDispatch();

  const submitCapture = async (headers: Record<string, string>, payload: CapturePayload) => {
    setLoading(true);
    try {
      await apiService.transactions.capture(headers, payload);
      toast.success(t('drawer.capture_success'));
      dispatch(bumpRefreshCount());
      onSuccess?.();
    } catch (err) {
      const axiosMessage = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      toast.error(axiosMessage ?? t('drawer.capture_error'));
    } finally {
      setLoading(false);
    }
  };

  return { submitCapture, loading };
}
