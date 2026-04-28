import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiService } from '@/utils';
import { useToast } from '@/hooks/useToast';

interface DisputePayload {
  TransactionID: string;
  uuid: string;
  Scheme: string;
  CardNumber: string;
  Date: string;
  amount: number;
  AcquirerCode: string;
  AuthCode: string | null;
  CurrencyCode: string;
  TransactionType: string;
  IssuedDate: string;
  CaseType: string;
  ARN: string;
  ReasonCode: string;
  DueDate: string;
  DASMID: string;
  TimeZone: string;
  Currency: string;
}

export function useDispute(onSuccess?: () => void) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const toast = useToast();

  const submitDispute = async (payload: DisputePayload) => {
    setLoading(true);
    try {
      await apiService.chargeback.add(payload);
      toast.success(t('drawer.dispute_success'));
      onSuccess?.();
    } catch (err) {
      const axiosMessage = (err as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      toast.error(axiosMessage ?? t('drawer.dispute_error'));
    } finally {
      setLoading(false);
    }
  };

  return { submitDispute, loading };
}
