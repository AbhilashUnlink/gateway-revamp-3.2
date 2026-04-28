import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '@/utils';
import { useToast } from '@/hooks/useToast';

interface EditStatusPayload {
  transaction_id: string;
  message: string;
  status: string;
  authCode: string;
}

export function useEditStatus(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();

  const submitEditStatus = async (payload: EditStatusPayload) => {
    setLoading(true);
    try {
      await apiService.transactions.postUpdateStatus(payload);
      toast.success(t('drawer.edit_status_success'));
      onSuccess?.();
    } catch (err) {
      const axiosMessage = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      toast.error(axiosMessage ?? t('drawer.edit_status_error'));
    } finally {
      setLoading(false);
    }
  };

  return { submitEditStatus, loading };
}
