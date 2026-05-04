import { useTranslation } from 'react-i18next';
import { InfoField, InfoGrid } from './InfoField';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

interface Props {
  data: TransactionDetailsData;
}

function deriveIntegrationMethod(data: TransactionDetailsData): string {
  return data.ThreeDSecureInfo ? '3DS' : 'Non 3DS';
}

export function MerchantInformation({ data }: Props) {
  const { t } = useTranslation();
  return (
    <InfoGrid>
      <InfoField label={t('transaction_details.merchant_account')} value={data.Merchant} copyable />
      <InfoField
        label={t('transaction_details.merchant_account_en')}
        value={data.LegalNameInEnglish || null}
        copyable
      />
      <InfoField
        label={t('transaction_details.merchant_ref_id')}
        value={data.MerchantRefNumber}
        copyable
      />
      <InfoField label={t('transaction_details.das_mid')} value={data.DASMID} copyable />
      <InfoField label={t('transaction_details.product_type')} value={data.ProductType} />
      <InfoField label={t('transaction_details.acquirer')} value={data.AcquirerCode} />
      <InfoField label={t('transaction_details.acquirer_mid')} value={data.AcquirerMID} copyable />
      <InfoField
        label={t('transaction_details.acquirer_reference_number')}
        value={data.AcquirerReferenceNumber}
        copyable
      />
      <InfoField
        label={t('transaction_details.integration_method')}
        value={deriveIntegrationMethod(data)}
      />
      <InfoField label={t('transaction_details.integration_type')} value={data.PaymentType} />
    </InfoGrid>
  );
}
