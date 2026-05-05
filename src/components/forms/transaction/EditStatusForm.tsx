import { useTranslation } from 'react-i18next';
import { DasForm } from '@/components/das-form';
import type { FormSchema } from '@/components/das-form';

export const EDIT_STATUS_FORM_ID = 'edit-status-form';

export interface EditStatusFormValues {
  status: string;
  authCode: string;
  message: string;
}

const STATUS_OPTIONS = [
  { label: 'Successful', value: 'SUCCESSFUL' },
  { label: 'Not Successful', value: 'NOTSUCCESSFUL' },
];

interface EditStatusFormProps {
  defaultAuthCode?: string;
  onSubmit: (values: EditStatusFormValues) => void;
}

export function EditStatusForm({ defaultAuthCode = '', onSubmit }: EditStatusFormProps) {
  const { t } = useTranslation();

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

  return (
    <div className="flex flex-col gap-3 p-6">
      <h2 className="text-base font-semibold text-[#1a1a1a]">{t('drawer.edit_status_title')}</h2>
      <DasForm
        id={EDIT_STATUS_FORM_ID}
        schema={schema}
        onSubmit={onSubmit}
        className="gap-0"
        defaultValues={{ status: '', authCode: defaultAuthCode, message: '' }}
      >
        <DasForm.Fields />
      </DasForm>
    </div>
  );
}
