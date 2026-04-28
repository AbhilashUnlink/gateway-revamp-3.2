import { useTranslation } from 'react-i18next';
import { InfoField, InfoGrid } from './InfoField';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

interface Props {
  data: TransactionDetailsData;
}

export function PaymentCardInformation({ data }: Props) {
  const { t } = useTranslation();
  return (
    <InfoGrid>
      <InfoField label={t('transaction_details.expiry_date')} value={data.ExpiryDate} />
      <InfoField label={t('transaction_details.card_holder')} value={data.CardHolder} />
      <InfoField
        label={t('transaction_details.hash_card_number')}
        value={data.HashCardNumber}
        copyable
      />
    </InfoGrid>
  );
}
