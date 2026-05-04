import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import DasDrawer from '@/components/ui/DasDrawer';
import { Button } from '@/components/ui/button';
import { DasForm } from '@/components/das-form';
import type { FormSchema } from '@/components/das-form';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useDrawerTransaction } from '@/hooks/transactions/useDrawerTransaction';
import { useDispute } from '@/hooks/transactions/useDispute';
import { CHARGEBACK_STAGE_OPTIONS } from '@/hooks/transactions/useChargebackHistory';
import { useAppSelector } from '@/store/hooks';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import { useTransactionActions } from '@/hooks/transactions/useTransactionActions';
import type { RootState } from '@/store';

const FORM_ID = 'dispute-form';

interface DisputeFormValues {
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

export default function DisputeDrawer({ type }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { data } = useTransactionActions();
  const { handleClose } = useDrawerTransaction({ type });
  const { submitDispute, loading } = useDispute(handleClose);
  const reasonCodeMap = useAppSelector(
    (state: RootState) =>
      state.gatewayConfig.config?.chargebackReasonCode as ReasonCodeMap | undefined
  );
  const scheme = data?.Scheme ?? '';
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
        value: String(data?.Amount ?? '0'),
        suffix: data?.CurrencyCode ?? 'USD',
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
        value: data?.TransactionRefID ?? '',
        required: true,
      },
    ],
  };

  const onSubmit = (values: DisputeFormValues) =>
    submitDispute({
      TransactionID: data?.TransactionRefID ?? '',
      uuid: data?.TransactionRefID ?? '',
      Scheme: data?.Scheme ?? '',
      CardNumber: data?.CardNumber ?? '',
      Date: data?.Date ?? '',
      amount: Number(data?.Amount ?? 0),
      AcquirerCode: data?.AcquirerCode ?? '',
      AuthCode: data?.AuthCode ?? null,
      CurrencyCode: data?.CurrencyCode ?? '',
      TransactionType: data?.TransactionType ?? '',
      IssuedDate: new Date().toISOString(),
      CaseType: values.CaseType,
      ARN: values.ARN,
      ReasonCode: values.ReasonCode,
      DueDate: new Date(values.DueDate).toISOString(),
      DASMID: data?.DASMID ?? '',
      TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      Currency: data?.CurrencyCode ?? '',
    });

  return (
    <>
      <DasDrawer.Header>
        <DrawerTransactionHeader
          activeTab="dispute"
          type={type}
          data={{ transactionRefId: data?.TransactionRefID ?? '' }}
        />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <div className="flex flex-col gap-3 p-6">
          <h2 className="text-base font-semibold text-[#1a1a1a]">
            {t('drawer.dispute_drawer_title')}
          </h2>
          <DasForm
            id={FORM_ID}
            schema={schema}
            onSubmit={onSubmit}
            className="gap-0"
            defaultValues={{ CaseType: '', ReasonCode: '', ARN: '', DueDate: '' }}
          >
            <DasForm.Fields />
          </DasForm>
        </div>
      </DasDrawer.Body>

      <DasDrawer.Footer>
        <div className="flex gap-3">
          <Button
            type="submit"
            form={FORM_ID}
            disabled={loading}
            className="flex-1 shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {t('drawer.submit')}
              </span>
            ) : (
              t('drawer.submit')
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="flex-1"
            disabled={loading}
            onClick={handleClose}
          >
            {t('drawer.cancel')}
          </Button>
        </div>
      </DasDrawer.Footer>
    </>
  );
}
