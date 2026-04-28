import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '@/utils';
import { useToast } from '@/hooks/useToast';

interface VoidPayload {
  id: string;
  merchant_id: string;
}

export function useVoid(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();

  const submitVoid = async (payload: VoidPayload) => {
    setLoading(true);
    try {
      await apiService.transactions.postVoid(payload);
      toast.success(t('drawer.void_success'));
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
