import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DasForm } from '@/components/das-form';
import type { FormSchema } from '@/components/das-form';
import { calculateTransactionAmounts } from '@/utils/calculateTransactionAmounts';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

export const REFUND_FORM_ID = 'refund-form';

export interface RefundFormValues {
  refundAmount: string;
  reference: string;
  consent: boolean;
}

interface RefundFormProps {
  transactionDetail: TransactionDetailsData | null;
  onSubmit: (values: RefundFormValues) => void;
}

export function RefundForm({ transactionDetail, onSubmit }: RefundFormProps) {
  const { t } = useTranslation();

  const { amount, remainingAmount } = useMemo(
    () => calculateTransactionAmounts(transactionDetail, 'REFUND'),
    [transactionDetail]
  );

  const originalAmount = amount.toFixed(2);
  const remainingAmountDisplay = remainingAmount.toFixed(2);
  const currency = (transactionDetail?.CurrencyCode as string) ?? 'USD';

  const schema: FormSchema = {
    fieldGap: 4,
    fields: [
      {
        type: 'display',
        name: 'originalAmountDisplay',
        label: t('drawer.original_amount'),
        value: originalAmount,
        suffix: currency,
        required: true,
      },
      {
        type: 'display',
        name: 'remainingAmountDisplay',
        label: t('drawer.remaining'),
        value: remainingAmountDisplay,
        suffix: currency,
        required: true,
      },
      {
        type: 'input',
        name: 'refundAmount',
        inputType: 'number',
        label: t('drawer.refund_amount'),
        placeholder: t('drawer.refund_amount_placeholder'),
        rules: { required: true, validate: (v: string) => parseFloat(v) > 0 },
        hint: t('drawer.refund_hint'),
        required: true,
      },
      {
        type: 'textarea',
        name: 'reference',
        label: `${t('drawer.reference')} ${t('drawer.optional')}`,
        maxLength: 128,
        hint: t('drawer.reference_hint'),
      },
      {
        type: 'checkbox',
        name: 'consent',
        label: t('drawer.consent_text'),
        rules: { required: true },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-3 p-6">
      <h2 className="text-base font-semibold text-[#1a1a1a]">{t('drawer.issue_a_refund')}</h2>
      <DasForm
        id={REFUND_FORM_ID}
        schema={schema}
        onSubmit={onSubmit}
        className="gap-0"
        defaultValues={{
          refundAmount: '',
          reference: '',
          consent: false,
        }}
      >
        <DasForm.Fields />
      </DasForm>
    </div>
  );
}
