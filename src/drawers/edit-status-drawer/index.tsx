import { useTranslation } from 'react-i18next';
import DasDrawer from '@/components/ui/das-drawer';
import { DasSpinner } from '@/components/ui/das-spinner';
import { Button } from '@/components/ui/button';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useDrawerTransaction } from '@/hooks/transactions/useDrawerTransaction';
import { useEditStatus } from '@/hooks/transactions/useEditStatus';
import { useTransactionActions } from '@/hooks/transactions/useTransactionActions';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';
import {
  EditStatusForm,
  EDIT_STATUS_FORM_ID,
  type EditStatusFormValues,
} from '@/components/forms/transaction/EditStatusForm';

export default function EditStatusDrawer({ type, data }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { handleClose } = useDrawerTransaction({ type, data });
  const { submitEditStatus, loading } = useEditStatus(handleClose);
  const { data: details } = useTransactionActions();
  const transactionId = String(details?.TransactionRefID ?? '');
  const currentAuthCode = details?.AuthCode ?? '';

  const onSubmit = (values: EditStatusFormValues) =>
    submitEditStatus({
      transaction_id: transactionId,
      message: values.message,
      status: values.status,
      authCode: values.authCode,
    });

  return (
    <>
      <DasDrawer.Header>
        <DrawerTransactionHeader activeTab="edit-status" type={type} data={data} />
      </DasDrawer.Header>

      <DasDrawer.Body>
        <EditStatusForm defaultAuthCode={currentAuthCode ?? ''} onSubmit={onSubmit} />
      </DasDrawer.Body>

      <DasDrawer.Footer>
        <div className="flex gap-3">
          <Button
            type="submit"
            form={EDIT_STATUS_FORM_ID}
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
