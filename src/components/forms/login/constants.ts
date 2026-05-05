import type { TFunction } from 'i18next';
import type { FormSchema } from '@/types/form/form.types';

const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const getLoginSchema = (t: TFunction): FormSchema => ({
  columns: 1,
  fieldGap: 10,
  fields: [
    {
      name: 'username',
      type: 'input',
      inputType: 'text',
      placeholder: t('login_form.email_placeholder'),
      icon: 'mail',
      rules: {
        required: t('login_form.email_required'),
        validate: (val: string) =>
          EMAIL_REGEX.test(String(val).toLowerCase()) || t('login_form.email_invalid'),
      },
    },
    {
      name: 'password',
      type: 'input',
      inputType: 'password',
      placeholder: t('login_form.password_placeholder'),
      icon: 'lock',
      rules: {
        required: t('login_form.password_required'),
      },
    },
  ],
  actions: [
    {
      type: 'submit',
      label: t('login_form.submit'),
      loadingLabel: t('login_form.submitting'),
    },
  ],
});
