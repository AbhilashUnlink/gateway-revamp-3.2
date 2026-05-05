import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DasForm } from '@/components/das-form';
import type { FormSchema } from '@/components/das-form';
import { calculateTransactionAmounts } from '@/utils/calculateTransactionAmounts';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

export const CAPTURE_FORM_ID = 'capture-form';

export interface CaptureFormValues {
  captureAmount: string;
  reference: string;
  consent: boolean;
}

interface CaptureFormProps {
  transactionDetail: TransactionDetailsData | null;
  onSubmit: (values: CaptureFormValues) => void;
}

export function CaptureForm({ transactionDetail, onSubmit }: CaptureFormProps) {
  const { t } = useTranslation();

  const { amount, remainingAmount } = useMemo(
    () => calculateTransactionAmounts(transactionDetail, 'CAPTURE'),
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
        name: 'captureAmount',
        inputType: 'number',
        label: t('drawer.capture_amount'),
        placeholder: t('drawer.capture_amount_placeholder'),
        suffix: currency,
        rules: {
          required: t('drawer.capture_amount_required'),
          validate: (v: string) => {
            if (v === undefined || v === null || v === '') {
              return t('drawer.capture_amount_required');
            }
            const value = parseFloat(v);
            if (!(value > 0)) return t('drawer.capture_hint');
            if (value > remainingAmount) return t('drawer.capture_exceeds_remaining');
            return true;
          },
        },
        hint: t('drawer.capture_hint'),
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
        label: t('drawer.capture_consent_text'),
        rules: { required: true },
      },
    ],
  };

  return (
    <div className="flex flex-col gap-3 p-6">
      <h2 className="text-base font-semibold text-[#1a1a1a]">{t('drawer.issue_a_capture')}</h2>
      <DasForm
        id={CAPTURE_FORM_ID}
        schema={schema}
        onSubmit={onSubmit}
        className="gap-0"
        defaultValues={{
          captureAmount: '',
          reference: '',
          consent: false,
        }}
      >
        <DasForm.Fields />
      </DasForm>
    </div>
  );
}
