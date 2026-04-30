import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import DasDrawer from '@/components/ui/DasDrawer';
import { Button } from '@/components/ui/button';
import { DasForm } from '@/components/DasForm';
import type { FormSchema } from '@/components/DasForm';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useDrawerTransaction } from '@/hooks/useDrawerTransaction';
import { useRefund } from '@/hooks/useRefund';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import { calculateTransactionAmounts } from '@/utils/calculateTransactionAmounts';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';

const FORM_ID = 'refund-form';

interface RefundFormValues {
  refundAmount: string;
  reference: string;
  consent: boolean;
}

export default function RefundDrawer({ type, data }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { handleClose } = useDrawerTransaction({ type, data });
  const { submitRefund, loading } = useRefund(handleClose);
  const { data: transactionDetail } = useTransactionActions();

  const { amount, remainingAmount } = useMemo(
    () => calculateTransactionAmounts(transactionDetail, 'REFUND'),
    [transactionDetail]
  );

  const originalAmount = amount.toFixed(2);
  const remainingAmountDisplay = remainingAmount.toFixed(2);
  const currency = (data?.currency as string) ?? transactionDetail?.CurrencyCode ?? 'USD';

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
        suffix: currency,
        rules: {
          required: t('drawer.refund_amount_required'),
          validate: (v: string) => {
            if (v === undefined || v === null || v === '') {
              return t('drawer.refund_amount_required');
            }
            const value = parseFloat(v);
            if (!(value > 0)) return t('drawer.refund_hint');
            if (value > remainingAmount) return t('drawer.refund_exceeds_remaining');
            return true;
          },
        },
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

  const onSubmit = (values: RefundFormValues) =>
    submitRefund({
      id: (data?.transactionId as string) ?? '',
      refundAmount: parseFloat(values.refundAmount),
      notes: values.reference,
      merchant_id: (data?.dasMid as string) ?? '',
    });

  return (
    <>
      <DasDrawer.Header>
        <DrawerTransactionHeader activeTab="refund" type={type} data={data} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <div className="flex flex-col gap-3 p-6">
          <h2 className="text-base font-semibold text-[#1a1a1a]">{t('drawer.issue_a_refund')}</h2>
          <DasForm
            id={FORM_ID}
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
