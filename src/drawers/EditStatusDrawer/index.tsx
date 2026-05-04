import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';
import DasDrawer from '@/components/ui/DasDrawer';
import { Button } from '@/components/ui/button';
import { DasForm } from '@/components/DasForm';
import type { FormSchema } from '@/components/DasForm';
import { DrawerTransactionHeader } from '@/drawers/shared/DrawerTransactionHeader';
import { useDrawerTransaction } from '@/hooks/useDrawerTransaction';
import { useEditStatus } from '@/hooks/useEditStatus';
import { useTransactionActions } from '@/hooks/useTransactionActions';
import type { DrawerComponentProps } from '@/components/drawer/drawerRegistry';

const FORM_ID = 'edit-status-form';

const STATUS_OPTIONS = [
  { label: 'Successful', value: 'SUCCESSFUL' },
  { label: 'Not Successful', value: 'NOTSUCCESSFUL' },
];

interface EditStatusFormValues {
  status: string;
  authCode: string;
  message: string;
}

export default function EditStatusDrawer({ type, data }: DrawerComponentProps) {
  const { t } = useTranslation();
  const { handleClose } = useDrawerTransaction({ type, data });
  const { submitEditStatus, loading } = useEditStatus(handleClose);
  const { data: details } = useTransactionActions();
  const transactionId = String(details?.TransactionRefID ?? '');
  const currentAuthCode = details?.AuthCode ?? '';

  const schema: FormSchema = {
    fieldGap: 4,
    fields: [
      {
        type: 'select',
        name: 'status',
        label: t('drawer.status'),
        placeholder: t('drawer.status_placeholder'),
        options: STATUS_OPTIONS,
        rules: { required: true },
        required: true,
      },
      {
        type: 'input',
        name: 'authCode',
        inputType: 'text',
        label: t('drawer.auth_code'),
        placeholder: t('drawer.auth_code_placeholder'),
        rules: { required: true },
        required: true,
      },
      {
        type: 'textarea',
        name: 'message',
        label: t('drawer.description'),
        maxLength: 256,
        hint: t('drawer.description_hint'),
        rules: { required: true },
        required: true,
      },
    ],
  };

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
        <div className="flex flex-col gap-3 p-6">
          <h2 className="text-base font-semibold text-[#1a1a1a]">
            {t('drawer.edit_status_title')}
          </h2>
          <DasForm
            id={FORM_ID}
            schema={schema}
            onSubmit={onSubmit}
            className="gap-0"
            defaultValues={{ status: '', authCode: currentAuthCode ?? '', message: '' }}
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
