import { useTranslation } from 'react-i18next';
import { DasAccordion } from '@/components/ui/accordian';
import { DasSpinner } from '@/components/ui/DasSpinner';
import { TransactionLifecycle } from '@/components/transactions/TransactionLifecycle';
import { useDrawerControl } from '@/hooks/useDrawerControl';
import { useDrawerParams } from '@/hooks/useDrawerParams';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';
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
  const { open } = useDrawerControl();
  const { getIdFromUrl } = useDrawerParams();
  const activeUuid = getIdFromUrl() ?? '';
  const showFullLoader = loading && !data;

  if (showFullLoader) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-sm text-[#808080]">
        <DasSpinner />
        {t('transaction_details.loading')}
      </div>
    );
  }

  if (!loading && (error || !data)) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-[#ff4343]">
        {error ?? t('transaction_details.error')}
      </div>
    );
  }

  if (!data) return null;

  const handleSelect = (uuid: string) => {
    open({ type: 'details', data: { transactionRefId: uuid } });
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <DasAccordion title={t('transaction_details.transaction_history')} defaultOpen>
        <TransactionLifecycle
          orientation="vertical"
          items={data.TransactionHistory}
          activeUuid={activeUuid}
          onSelect={handleSelect}
        />
      </DasAccordion>

      <DasAccordion title={t('transaction_details.transaction_information')}>
        <TransactionInformation data={data} loading={loading} />
      </DasAccordion>

      <DasAccordion title={t('transaction_details.merchant_information')}>
        <MerchantInformation data={data} loading={loading} />
      </DasAccordion>

      <DasAccordion title={t('transaction_details.payment_card_information')}>
        <PaymentCardInformation data={data} loading={loading} />
      </DasAccordion>

      <DasAccordion title={t('transaction_details.subscription_information')} noBorder>
        <SubscriptionInformation data={data} loading={loading} />
      </DasAccordion>
    </div>
  );
}

export default TransactionDetails;
