import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import { DasAccordion } from '@/components/ui/accordian';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';
import { TransactionHistory } from './TransactionHistory';
import { TransactionInformation } from './TransactionInformation';
import { MerchantInformation } from './MerchantInformation';
import { PaymentCardInformation } from './PaymentCardInformation';
import { SubscriptionInformation } from './SubscriptionInformation';

interface TransactionDetailsProps {
  data: TransactionDetailsData | null;
  loading: boolean;
  error: string | null;
}

function TransactionDetails({ data, loading, error }: TransactionDetailsProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-[#808080]">
        <Loader2 size={16} className="animate-spin" />
        {t('transaction_details.loading')}
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#ff4343]">
        {error ?? t('transaction_details.error')}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <DasAccordion title={t('transaction_details.transaction_history')} defaultOpen>
        <TransactionHistory items={data.TransactionHistory} />
      </DasAccordion>

      <DasAccordion title={t('transaction_details.transaction_information')}>
        <TransactionInformation data={data} />
      </DasAccordion>

      <DasAccordion title={t('transaction_details.merchant_information')}>
        <MerchantInformation data={data} />
      </DasAccordion>

      <DasAccordion title={t('transaction_details.payment_card_information')}>
        <PaymentCardInformation data={data} />
      </DasAccordion>

      <DasAccordion title={t('transaction_details.subscription_information')} noBorder>
        <SubscriptionInformation data={data} />
      </DasAccordion>
    </div>
  );
}

export default TransactionDetails;
