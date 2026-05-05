import { useTranslation } from 'react-i18next';
import DasDrawer from '@/components/ui/das-drawer';
import { DasSpinner } from '@/components/ui/das-spinner';
import { Button } from '@/components/ui/button';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useDrawerTransaction } from '@/hooks/transactions/useDrawerTransaction';
import { useDispute } from '@/hooks/transactions/useDispute';
import { useTransactionActions } from '@/hooks/transactions/useTransactionActions';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import {
  DisputeForm,
  DISPUTE_FORM_ID,
  type DisputeFormValues,
} from '@/components/forms/transaction/DisputeForm';

export default function DisputeDrawer({ type }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { data } = useTransactionActions();
  const { handleClose } = useDrawerTransaction({ type });
  const { submitDispute, loading } = useDispute(handleClose);

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
        <DisputeForm transactionDetail={data} onSubmit={onSubmit} />
      </DasDrawer.Body>

      <DasDrawer.Footer>
        <div className="flex gap-3">
          <Button
            type="submit"
            form={DISPUTE_FORM_ID}
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
