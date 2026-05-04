import { useTranslation } from 'react-i18next';
import { InfoField, InfoGrid } from './InfoField';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

interface Props {
  data: TransactionDetailsData;
}

export function TransactionInformation({ data }: Props) {
  const { t } = useTranslation();
  return (
    <InfoGrid>
      <InfoField label={t('transaction_details.response_code')} value={data.Response} copyable />
      <InfoField label={t('transaction_details.auth_code')} value={data.AuthCode} copyable />
      <InfoField label={t('transaction_details.gateway_response')} value={data.GatewayError} />
      <InfoField label={t('transaction_details.request_id')} value={data.RequestID} copyable />
      <InfoField label={t('transaction_details.statement_id')} value={data.trackID} copyable />
    </InfoGrid>
  );
}
