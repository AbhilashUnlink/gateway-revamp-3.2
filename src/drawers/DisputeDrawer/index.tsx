import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import DasDrawer from '@/components/ui/DasDrawer';
import { Button } from '@/components/ui/button';
import { DasForm } from '@/components/DasForm';
import type { FormSchema } from '@/components/DasForm';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useDrawerTransaction } from '@/hooks/useDrawerTransaction';
import { useDispute } from '@/hooks/useDispute';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { useAppSelector } from '@/store/hooks';
import { selectChargebackReasonCodeOptionsByScheme } from '@/store/slices/gatewayConfigSlice';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';

const FORM_ID = 'dispute-form';

interface DisputeFormValues {
  CaseType: string;
  ReasonCode: string;
  ARN: string;
  DueDate: string;
}

export default function DisputeDrawer({ type, data }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { handleClose } = useDrawerTransaction({ type, data });
  const { submitDispute, loading } = useDispute(handleClose);
  const { data: details } = useTransactionActions();

  const scheme = (data?.paymentScheme as string) ?? details?.Scheme ?? null;
  const reasonCodeSelector = useMemo(
    () => selectChargebackReasonCodeOptionsByScheme(scheme),
    [scheme]
  );
  const reasonCodeOptions = useAppSelector(reasonCodeSelector);

  const CASE_TYPE_OPTIONS = [
    { label: t('drawer.case_type_retrieval_request'), value: 'RetrievalRequest' },
    { label: t('drawer.case_type_first_chargeback'), value: 'FirstChargeback' },
    { label: t('drawer.case_type_second_chargeback'), value: 'SecondChargeback' },
    { label: t('drawer.case_type_auto_representment'), value: 'AutoRepresentment' },
    { label: t('drawer.case_type_chargeback_reversal'), value: 'ChargebackReversal' },
    { label: t('drawer.case_type_evidence_under_review'), value: 'EvidenceUnderReview' },
  ];

  const schema: FormSchema = {
    fieldGap: 4,
    fields: [
      {
        type: 'select',
        name: 'CaseType',
        label: t('drawer.case_type'),
        placeholder: 'Select',
        options: CASE_TYPE_OPTIONS,
        rules: { required: true },
        required: true,
      },
      {
        type: 'select',
        name: 'ReasonCode',
        label: t('drawer.reason_description'),
        placeholder: 'Select',
        options: reasonCodeOptions,
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
        value: String(data?.amount ?? '0'),
        suffix: (data?.currency as string) ?? 'USD',
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
        value: (data?.transactionId as string) ?? '',
        required: true,
      },
    ],
  };

  const onSubmit = (values: DisputeFormValues) =>
    submitDispute({
      TransactionID: (data?.transactionId as string) ?? '',
      uuid: (data?.transactionId as string) ?? '',
      Scheme: (data?.paymentScheme as string) ?? '',
      CardNumber: (data?.cardNumber as string) ?? '',
      Date: (data?.transactionDate as string) ?? '',
      amount: Number(data?.amount ?? 0),
      AcquirerCode: (data?.acquirer as string) ?? '',
      AuthCode: (data?.authCode as string) ?? null,
      CurrencyCode: (data?.currency as string) ?? '',
      TransactionType: (data?.transactionType as string) ?? '',
      IssuedDate: new Date().toISOString(),
      CaseType: values.CaseType,
      ARN: values.ARN,
      ReasonCode: values.ReasonCode,
      DueDate: new Date(values.DueDate).toISOString(),
      DASMID: (data?.dasMid as string) ?? '',
      TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      Currency: (data?.currency as string) ?? '',
    });

  return (
    <>
      <DasDrawer.Header>
        <DrawerTransactionHeader activeTab="dispute" type={type} data={data} />
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
