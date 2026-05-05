import { useTranslation } from 'react-i18next';
import { InfoField, InfoGrid } from './InfoField';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

interface Props {
  data: TransactionDetailsData;
  loading?: boolean;
}

export function TransactionInformation({ data, loading }: Props) {
  const { t } = useTranslation();
  return (
    <InfoGrid>
      <InfoField
        label={t('transaction_details.response_code')}
        value={data.Response}
        copyable
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.auth_code')}
        value={data.AuthCode}
        copyable
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.gateway_response')}
        value={data.GatewayError}
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.request_id')}
        value={data.RequestID}
        copyable
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.statement_id')}
        value={data.trackID}
        copyable
        loading={loading}
      />
    </InfoGrid>
  );
}
