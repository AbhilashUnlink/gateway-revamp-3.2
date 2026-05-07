import { useFormContext, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { DasForm } from '@/components/das-form';
import type { FormSchema } from '@/components/das-form';
import type { FilterFieldOption } from '@/components/filter/types';
import { EMAIL_REGEX } from '@/constants/validation';

export const MERCHANT_USER_FORM_ID = 'merchant-user-form';

export interface MerchantUserFormValues {
  status: 'ACTIVE' | 'INACTIVE';
  accessLevel: string;
  firstName: string;
  lastName: string;
  email: string;
  /** Selected DASMIDs for this user — must be a subset of the merchant's products. */
  dasmid: string[];
  isChargebackNoificationEnabled: boolean;
  isStatementNoificationEnabled: boolean;
  isEmergencyHolidayNoificationEnabled: boolean;
  isMonthlyHolidayNoificationEnabled: boolean;
}

const NOTIFICATION_KEYS: Array<{
  field: keyof MerchantUserFormValues;
  labelKey: string;
}> = [
  { field: 'isChargebackNoificationEnabled', labelKey: 'merchant_user_form.chargeback' },
  { field: 'isStatementNoificationEnabled', labelKey: 'merchant_user_form.statement' },
  {
    field: 'isEmergencyHolidayNoificationEnabled',
    labelKey: 'merchant_user_form.emergency_holiday',
  },
  {
    field: 'isMonthlyHolidayNoificationEnabled',
    labelKey: 'merchant_user_form.monthly_public_holidays',
  },
];

interface MerchantUserFormProps {
  defaultValues?: Partial<MerchantUserFormValues>;
  /** DASMID options — sourced from the current merchant's products only. */
  dasmidOptions: FilterFieldOption[];
  onSubmit: (values: MerchantUserFormValues) => void;
}

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

export function MerchantUserForm({
  defaultValues,
  dasmidOptions,
  onSubmit,
}: MerchantUserFormProps) {
  const { t } = useTranslation();
  const schema = getMerchantUserSchema(t, dasmidOptions);

  return (
    <DasForm<MerchantUserFormValues>
      id={MERCHANT_USER_FORM_ID}
      schema={schema}
      onSubmit={onSubmit}
      className="gap-5 px-6 pt-4 pb-6"
      defaultValues={{
        status: 'ACTIVE',
        accessLevel: 'ADMIN',
        firstName: '',
        lastName: '',
        email: '',
        dasmid: [],
        isChargebackNoificationEnabled: false,
        isStatementNoificationEnabled: false,
        isEmergencyHolidayNoificationEnabled: false,
        isMonthlyHolidayNoificationEnabled: false,
        ...defaultValues,
      }}
    >
      <DasForm.Fields />
      <NotificationsSection />
    </DasForm>
  );
}

function NotificationsSection() {
  const { t } = useTranslation();
  const { control, setValue, register } = useFormContext<MerchantUserFormValues>();
  // `useWatch` keeps React Compiler happy and only re-renders this section
  // when the watched fields change.
  const watched = useWatch({
    control,
    name: NOTIFICATION_KEYS.map((k) => k.field) as Array<keyof MerchantUserFormValues>,
  });
  const allChecked = watched.every((v) => v === true);

  const handleSelectAll = (next: boolean) => {
    NOTIFICATION_KEYS.forEach(({ field }) => {
      setValue(field, next, { shouldDirty: true });
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold leading-5 text-[#1a1a1a]">
          {t('merchant_user_form.receive_notifications')}
        </h3>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-[#1a1a1a]">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => handleSelectAll(e.target.checked)}
            aria-label={t('merchant_user_form.select_all')}
            className={CHECKBOX_CLASS}
          />
          {t('merchant_user_form.select_all')}
        </label>
      </div>
      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {NOTIFICATION_KEYS.map(({ field, labelKey }) => (
          <label
            key={field}
            htmlFor={field}
            className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-[#1a1a1a]"
          >
            <input
              id={field}
              type="checkbox"
              {...register(field)}
              className={CHECKBOX_CLASS}
            />
            {t(labelKey)}
          </label>
        ))}
      </div>
    </div>
  );
}

const CHECKBOX_CLASS =
  'mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border border-[#e5e5e5] accent-[#f7941d]';
