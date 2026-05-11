import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { DasForm } from '@/components/das-form';
import type { FormSchema } from '@/components/das-form';

export const MERCHANT_IP_FORM_ID = 'merchant-ip-form';

export interface MerchantIpFormValues {
  ipAddress: string;
  status: string;
  comments: string;
}

const COMMENTS_MAX_LENGTH = 128;
// Plain IPv4 — `\d{1,3}.\d{1,3}.\d{1,3}.\d{1,3}` with each octet 0-255.
const IP_PATTERN =
  /^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$/;

interface MerchantIpFormProps {
  defaultValues?: Partial<MerchantIpFormValues>;
  /** When true, the IP address input is locked (edit mode). */
  ipDisabled?: boolean;
  onSubmit: (values: MerchantIpFormValues) => void;
}

export const getMerchantIpSchema = (t: TFunction, ipDisabled?: boolean): FormSchema => ({
  columns: 2,
  fieldGap: 4,
  fields: [
    {
      name: 'ipAddress',
      type: 'input',
      inputType: 'text',
      label: t('merchant_ip_form.ip_address'),
      placeholder: t('merchant_ip_form.ip_address'),
      disabled: ipDisabled,
      required: !ipDisabled,
      rules: ipDisabled
        ? {}
        : {
            required: t('merchant_ip_form.ip_required'),
            pattern: { value: IP_PATTERN, message: t('merchant_ip_form.ip_invalid') },
          },
    },
    {
      name: 'status',
      type: 'select',
      label: t('merchant_ip_form.status'),
      placeholder: t('merchant_ip_form.status_placeholder'),
      required: true,
      rules: { required: t('merchant_ip_form.status_required') },
      options: [
        { value: 'NEW', label: 'NEW' },
        { value: 'SUBMITTED', label: 'SUBMITTED' },
        { value: 'APPROVED', label: 'APPROVED' },
        { value: 'REJECTED', label: 'REJECTED' },
      ],
    },
    {
      name: 'comments',
      type: 'textarea',
      label: t('merchant_ip_form.comments'),
      placeholder: t('merchant_ip_form.comments_placeholder'),
      maxLength: COMMENTS_MAX_LENGTH,
      rows: 3,
      hint: t('merchant_ip_form.comments_hint'),
      required: true,
      colSpan: 2,
      rules: {
        required: t('merchant_ip_form.comments_required'),
        maxLength: {
          value: COMMENTS_MAX_LENGTH,
          message: t('merchant_ip_form.comments_too_long'),
        },
      },
    },
  ],
});

export function MerchantIpForm({ defaultValues, ipDisabled, onSubmit }: MerchantIpFormProps) {
  const { t } = useTranslation();
  const schema = getMerchantIpSchema(t, ipDisabled);

  return (
    <DasForm<MerchantIpFormValues>
      id={MERCHANT_IP_FORM_ID}
      schema={schema}
      onSubmit={onSubmit}
      className="gap-5 px-6 pt-4 pb-6"
      defaultValues={{
        ipAddress: defaultValues?.ipAddress ?? '',
        status: defaultValues?.status ?? 'NEW',
        comments: defaultValues?.comments ?? '',
      }}
    >
      <DasForm.Fields />
    </DasForm>
  );
}
