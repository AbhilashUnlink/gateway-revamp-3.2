import { useTranslation } from 'react-i18next';
import { InfoField, InfoGrid } from './InfoField';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

interface Props {
  data: TransactionDetailsData;
}

export function SubscriptionInformation({ data }: Props) {
  const { t } = useTranslation();
  const sub = data.SubscriptionDetails;

  if (!sub) {
    return <p className="text-sm text-[#808080]">{t('transaction_details.no_subscription')}</p>;
  }

  return (
    <InfoGrid>
      <InfoField
        label={t('transaction_details.subscription_id')}
        value={sub.SubscriptionID}
        copyable
      />
      <InfoField label={t('transaction_details.subscription_plan')} value={sub.Plan} />
      <InfoField label={t('transaction_details.billing_cycle')} value={sub.BillingCycle} />
      <InfoField label={t('transaction_details.next_billing')} value={sub.NextBilling} />
      <InfoField label={t('transaction_details.cycle_billed')} value={sub.CycleBilled} />
      <InfoField label={t('transaction_details.subscription_status')} value={sub.Status} />
    </InfoGrid>
  );
}
