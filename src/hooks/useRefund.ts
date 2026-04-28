import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '@/utils';
import { useToast } from '@/hooks/useToast';

interface RefundPayload {
  id: string;
  refundAmount: number;
  notes: string;
  merchant_id: string;
}

export function useRefund(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();

  const submitRefund = async (payload: RefundPayload) => {
    setLoading(true);
    try {
      await apiService.transactions.refund(payload);
      toast.success(t('drawer.refund_success'));
      onSuccess?.();
    } catch (err) {
      const axiosMessage = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      toast.error(axiosMessage ?? t('drawer.refund_error'));
    } finally {
      setLoading(false);
    }
  };

  return { submitRefund, loading };
}
