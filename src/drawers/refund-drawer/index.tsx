import DasDrawer from '@/components/ui/das-drawer';
import { DasSpinner } from '@/components/ui/das-spinner';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useDrawerTransaction } from '@/hooks/transactions/useDrawerTransaction';
import { useRefund } from '@/hooks/transactions/useRefund';
import { useTransactionActions } from '@/hooks/transactions/useTransactionActions';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import {
  RefundForm,
  REFUND_FORM_ID,
  type RefundFormValues,
} from '@/components/forms/transaction/RefundForm';

export default function RefundDrawer({ type }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { handleClose } = useDrawerTransaction({ type });
  const { submitRefund, loading } = useRefund(handleClose);
  const { data: transactionDetail } = useTransactionActions();

  const onSubmit = (values: RefundFormValues) =>
    submitRefund(
      {
        'X-Authorization': `${transactionDetail?.SecretKey as string}`,
      },
      {
        id: (transactionDetail?.TransactionRefID as string) ?? '',
        refundAmount: parseFloat(values.refundAmount),
        notes: values.reference,
        merchant_id: (transactionDetail?.DASMID as string) ?? '',
      }
    );

  return (
    <>
      <DasDrawer.Header>
        <DrawerTransactionHeader
          activeTab="refund"
          type={type}
          data={{ transactionRefId: transactionDetail?.TransactionRefID }}
        />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <RefundForm transactionDetail={transactionDetail} onSubmit={onSubmit} />
      </DasDrawer.Body>

      <DasDrawer.Footer>
        <div className="flex gap-3">
          <Button
            type="submit"
            form={REFUND_FORM_ID}
            disabled={loading}
            className="flex-1 shadow-[0px_4px_9px_0px_rgba(0,0,0,0.1)]"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <DasSpinner className="h-4 w-4" />
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
