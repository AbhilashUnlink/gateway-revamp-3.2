import { useTranslation } from 'react-i18next';
import { InfoField, InfoGrid } from './InfoField';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

interface Props {
  data: TransactionDetailsData;
  loading?: boolean;
}

function deriveIntegrationMethod(data: TransactionDetailsData): string {
  return data.ThreeDSecureInfo ? '3DS' : 'Non 3DS';
}

export function MerchantInformation({ data, loading }: Props) {
  const { t } = useTranslation();
  return (
    <InfoGrid>
      <InfoField
        label={t('transaction_details.merchant_account')}
        value={data.Merchant}
        copyable
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.merchant_account_en')}
        value={data.LegalNameInEnglish || null}
        copyable
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.merchant_ref_id')}
        value={data.MerchantRefNumber}
        copyable
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.das_mid')}
        value={data.DASMID}
        copyable
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.product_type')}
        value={data.ProductType}
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.acquirer')}
        value={data.AcquirerCode}
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.acquirer_mid')}
        value={data.AcquirerMID}
        copyable
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.acquirer_reference_number')}
        value={data.AcquirerReferenceNumber}
        copyable
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.integration_method')}
        value={deriveIntegrationMethod(data)}
        loading={loading}
      />
      <InfoField
        label={t('transaction_details.integration_type')}
        value={data.PaymentType}
        loading={loading}
      />
    </InfoGrid>
  );
}
