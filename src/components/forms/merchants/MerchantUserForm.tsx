import { useForm, Controller, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/fields/Select';
import { MultiSelect } from '@/components/fields/MultiSelect';
import type { FilterFieldOption } from '@/components/filter/types';

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

const STATUS_OPTIONS: FilterFieldOption[] = [
  { value: 'ACTIVE', label: 'ACTIVE' },
  { value: 'INACTIVE', label: 'INACTIVE' },
];

const ROLE_OPTIONS: FilterFieldOption[] = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'EDITOR', label: 'Editor' },
  { value: 'VIEWER', label: 'Viewer' },
  { value: 'STAFF', label: 'Staff' },
];

interface MerchantUserFormProps {
  defaultValues?: Partial<MerchantUserFormValues>;
  /** DASMID options — sourced from the current merchant's products only. */
  dasmidOptions: FilterFieldOption[];
  onSubmit: (values: MerchantUserFormValues) => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

interface FieldLabelProps {
  text: string;
  required?: boolean;
}

function FieldLabel({ text, required }: FieldLabelProps) {
  return (
    <label className="text-sm font-semibold leading-5 text-[#1a1a1a]">
      {text}
      {required && <span className="text-[#ff4343]">*</span>}
    </label>
  );
}

interface CheckboxFieldProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
  ariaLabel?: string;
}

function CheckboxField({ checked, onChange, label, ariaLabel }: CheckboxFieldProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm leading-5 text-[#1a1a1a]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        aria-label={ariaLabel ?? label}
        className={cn(
          'h-4 w-4 shrink-0 cursor-pointer appearance-none rounded border border-[#bdbdbd] bg-white',
          'checked:border-[#f7941d] checked:bg-[#f7941d]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7941d]',
          'relative checked:after:absolute checked:after:inset-0 checked:after:flex checked:after:items-center checked:after:justify-center checked:after:text-[10px] checked:after:font-bold checked:after:text-white checked:after:content-["✓"]'
        )}
      />
      {label}
    </label>
  );
}

export function MerchantUserForm({
  defaultValues,
  dasmidOptions,
  onSubmit,
}: MerchantUserFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<MerchantUserFormValues>({
    mode: 'onTouched',
    defaultValues: {
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
    },
  });

  // `useWatch` (vs `watch()`) keeps React Compiler happy and only re-renders
  // this component when the watched fields change.
  const watchedNotifications = useWatch({
    control,
    name: NOTIFICATION_KEYS.map((k) => k.field),
  });
  const allChecked = watchedNotifications.every((v) => v === true);

  const handleSelectAll = (next: boolean) => {
    NOTIFICATION_KEYS.forEach(({ field }) => {
      setValue(field, next, { shouldDirty: true });
    });
  };

  return (
    <form
      id={MERCHANT_USER_FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 px-6 pt-4 pb-6"
      noValidate
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel text={t('merchant_user_form.user_status')} required />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Select
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v)}
                options={STATUS_OPTIONS}
                triggerClassName="h-11 px-4"
              />
            )}
          />
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel text={t('merchant_user_form.role')} required />
          <Controller
            control={control}
            name="accessLevel"
            render={({ field }) => (
              <Select
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v)}
                options={ROLE_OPTIONS}
                triggerClassName="h-11 px-4"
              />
            )}
          />
        </div>

        <div className="col-span-2 flex flex-col gap-2">
          <FieldLabel text={t('merchant_user_form.das_mid')} />
          <Controller
            control={control}
            name="dasmid"
            render={({ field }) => (
              <MultiSelect
                value={Array.isArray(field.value) ? field.value : []}
                onChange={(v) => field.onChange(v)}
                options={dasmidOptions}
                placeholder={t('merchant_user_form.das_mid_placeholder')}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel text={t('merchant_user_form.first_name')} required />
          <Controller
            control={control}
            name="firstName"
            rules={{ required: t('merchant_user_form.first_name_required') }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                className="h-11 rounded-xl"
                placeholder={t('merchant_user_form.first_name')}
              />
            )}
          />
          {errors.firstName && (
            <span className="text-xs text-[#ff4343]">{errors.firstName.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel text={t('merchant_user_form.last_name')} required />
          <Controller
            control={control}
            name="lastName"
            rules={{ required: t('merchant_user_form.last_name_required') }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                className="h-11 rounded-xl"
                placeholder={t('merchant_user_form.last_name')}
              />
            )}
          />
          {errors.lastName && (
            <span className="text-xs text-[#ff4343]">{errors.lastName.message}</span>
          )}
        </div>

        <div className="col-span-2 flex flex-col gap-2">
          <FieldLabel text={t('merchant_user_form.email_address')} required />
          <Controller
            control={control}
            name="email"
            rules={{
              required: t('merchant_user_form.email_required'),
              pattern: { value: EMAIL_PATTERN, message: t('merchant_user_form.email_invalid') },
            }}
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                type="email"
                className="h-11 rounded-xl"
                placeholder={t('merchant_user_form.email_address')}
              />
            )}
          />
          {errors.email && <span className="text-xs text-[#ff4343]">{errors.email.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold leading-5 text-[#1a1a1a]">
            {t('merchant_user_form.receive_notifications')}
          </h3>
          <CheckboxField
            checked={allChecked}
            onChange={handleSelectAll}
            label={t('merchant_user_form.select_all')}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          {NOTIFICATION_KEYS.map(({ field, labelKey }) => (
            <Controller
              key={field}
              control={control}
              name={field}
              render={({ field: rhfField }) => (
                <CheckboxField
                  checked={Boolean(rhfField.value)}
                  onChange={(next) => rhfField.onChange(next)}
                  label={t(labelKey)}
                />
              )}
            />
          ))}
        </div>
      </div>
    </form>
  );
}
