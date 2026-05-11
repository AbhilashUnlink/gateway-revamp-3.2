import type { TFunction } from 'i18next';
import type { FormSchema } from '@/components/das-form';
import type { FilterFieldOption } from '@/components/filter/types';
import { EMAIL_REGEX } from '@/constants/validation';

export const getMerchantUserSchema = (
  t: TFunction,
  dasmidOptions: FilterFieldOption[]
): FormSchema => ({
  columns: 2,
  fieldGap: 4,
  fields: [
    {
      name: 'status',
      type: 'select',
      label: t('merchant_user_form.user_status'),
      required: true,
      options: [
        { value: 'ACTIVE', label: 'ACTIVE' },
        { value: 'INACTIVE', label: 'INACTIVE' },
      ],
    },
    {
      name: 'accessLevel',
      type: 'select',
      label: t('merchant_user_form.role'),
      required: true,
      options: [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'EDITOR', label: 'Editor' },
        { value: 'VIEWER', label: 'Viewer' },
        { value: 'STAFF', label: 'Staff' },
      ],
    },
    {
      name: 'dasmid',
      type: 'multiselect',
      label: t('merchant_user_form.das_mid'),
      placeholder: t('merchant_user_form.das_mid_placeholder'),
      options: dasmidOptions,
      colSpan: 2,
    },
    {
      name: 'firstName',
      type: 'input',
      inputType: 'text',
      label: t('merchant_user_form.first_name'),
      placeholder: t('merchant_user_form.first_name'),
      required: true,
      rules: { required: t('merchant_user_form.first_name_required') },
    },
    {
      name: 'lastName',
      type: 'input',
      inputType: 'text',
      label: t('merchant_user_form.last_name'),
      placeholder: t('merchant_user_form.last_name'),
      required: true,
      rules: { required: t('merchant_user_form.last_name_required') },
    },
    {
      name: 'email',
      type: 'input',
      inputType: 'email',
      label: t('merchant_user_form.email_address'),
      placeholder: t('merchant_user_form.email_address'),
      required: true,
      colSpan: 2,
      rules: {
        required: t('merchant_user_form.email_required'),
        pattern: { value: EMAIL_REGEX, message: t('merchant_user_form.email_invalid') },
      },
    },
  ],
});
