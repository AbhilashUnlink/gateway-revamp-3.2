import { useTranslation } from 'react-i18next';
import { DasForm } from '@/components/das-form';
import type { FormSchema } from '@/components/das-form';
import { CHARGEBACK_STAGE_OPTIONS } from '@/hooks/transactions/useChargebackHistory';
import { useAppSelector } from '@/store/hooks';
import type { RootState } from '@/store';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

export const DISPUTE_FORM_ID = 'dispute-form';

export interface DisputeFormValues {
  CaseType: string;
  ReasonCode: string;
  ARN: string;
  DueDate: string;
}

interface ReasonCodeEntry {
  ReasonCode: string;
  ReasonCodeDescription: string;
}
type ReasonCodeMap = Record<string, ReasonCodeEntry[]>;

interface DisputeFormProps {
  transactionDetail: TransactionDetailsData | null;
  onSubmit: (values: DisputeFormValues) => void;
}

export function DisputeForm({ transactionDetail, onSubmit }: DisputeFormProps) {
  const { t } = useTranslation();

  const reasonCodeMap = useAppSelector(
    (state: RootState) =>
      state.gatewayConfig.config?.chargebackReasonCode as ReasonCodeMap | undefined
  );
  const scheme = transactionDetail?.Scheme ?? '';
  const reasonCodeFormattedOptions =
    reasonCodeMap && scheme && reasonCodeMap[scheme]
      ? reasonCodeMap[scheme].map((item) => ({
          label: item.ReasonCodeDescription,
          value: item.ReasonCode,
        }))
      : [];

  const schema: FormSchema = {
    fieldGap: 4,
    fields: [
      {
        type: 'select',
        name: 'CaseType',
        label: t('drawer.case_type'),
        placeholder: 'Select',
        options: CHARGEBACK_STAGE_OPTIONS,
        rules: { required: true },
        required: true,
      },
      {
        type: 'select',
        name: 'ReasonCode',
        label: t('drawer.reason_description'),
        placeholder: 'Select',
        options: reasonCodeFormattedOptions,
        rules: { required: true },
        required: true,
      },
      {
        type: 'input',
        name: 'ARN',
        inputType: 'text',
        label: t('drawer.arn'),
        placeholder: t('drawer.arn_placeholder'),
        rules: { required: true },
        required: true,
      },
      {
        type: 'display',
        name: 'disputeAmountDisplay',
        label: t('drawer.dispute_amount'),
        value: String(transactionDetail?.Amount ?? '0'),
        suffix: transactionDetail?.CurrencyCode ?? 'USD',
        required: true,
      },
      {
        type: 'date',
        name: 'DueDate',
        label: t('drawer.due_date'),
        placeholder: t('drawer.due_date_placeholder'),
        rules: { required: true },
        required: true,
      },
      {
        type: 'display',
        name: 'orderIdDisplay',
        label: t('drawer.order_id'),
        value: transactionDetail?.TransactionRefID ?? '',
        required: true,
      },
    ],
  };

  return (
    <div className="flex flex-col gap-3 p-6">
      <h2 className="text-base font-semibold text-[#1a1a1a]">{t('drawer.dispute_drawer_title')}</h2>
      <DasForm
        id={DISPUTE_FORM_ID}
        schema={schema}
        onSubmit={onSubmit}
        className="gap-0"
        defaultValues={{ CaseType: '', ReasonCode: '', ARN: '', DueDate: '' }}
      >
        <DasForm.Fields />
      </DasForm>
    </div>
  );
}
