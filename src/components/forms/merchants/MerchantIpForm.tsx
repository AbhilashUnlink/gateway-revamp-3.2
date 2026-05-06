import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/fields/Select';
import type { FilterFieldOption } from '@/components/filter/types';

export const MERCHANT_IP_FORM_ID = 'merchant-ip-form';

export interface MerchantIpFormValues {
  ipAddress: string;
  status: string;
  comments: string;
}

const STATUS_OPTIONS: FilterFieldOption[] = [
  { value: 'NEW', label: 'NEW' },
  { value: 'SUBMITTED', label: 'SUBMITTED' },
  { value: 'APPROVED', label: 'APPROVED' },
  { value: 'REJECTED', label: 'REJECTED' },
];

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

export function MerchantIpForm({ defaultValues, ipDisabled, onSubmit }: MerchantIpFormProps) {
  const { t } = useTranslation();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MerchantIpFormValues>({
    mode: 'onTouched',
    defaultValues: {
      ipAddress: defaultValues?.ipAddress ?? '',
      status: defaultValues?.status ?? 'NEW',
      comments: defaultValues?.comments ?? '',
    },
  });

  // Belt-and-suspenders: if the consumer changes `defaultValues` after mount
  // (e.g. switching the row being edited without remounting the form), sync
  // the form state. The `key` prop on the drawer side already remounts on
  // distinct row ids, so this only fires when needed.
  useEffect(() => {
    if (!defaultValues) return;
    reset({
      ipAddress: defaultValues.ipAddress ?? '',
      status: defaultValues.status ?? 'NEW',
      comments: defaultValues.comments ?? '',
    });
    // Track the actual values, not the object reference.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues?.ipAddress, defaultValues?.status, defaultValues?.comments, reset]);

  return (
    <form
      id={MERCHANT_IP_FORM_ID}
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 px-6 pt-4 pb-6"
      noValidate
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <FieldLabel text={t('merchant_ip_form.ip_address')} required={!ipDisabled} />
          <Controller
            control={control}
            name="ipAddress"
            rules={
              ipDisabled
                ? {}
                : {
                    required: t('merchant_ip_form.ip_required'),
                    pattern: {
                      value: IP_PATTERN,
                      message: t('merchant_ip_form.ip_invalid'),
                    },
                  }
            }
            render={({ field }) => (
              <Input
                {...field}
                value={field.value ?? ''}
                disabled={ipDisabled}
                className="h-11 rounded-xl disabled:cursor-not-allowed disabled:bg-[#fafafa] disabled:text-[#808080]"
                placeholder={t('merchant_ip_form.ip_address')}
              />
            )}
          />
          {errors.ipAddress && (
            <span className="text-xs text-[#ff4343]">{errors.ipAddress.message}</span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <FieldLabel text={t('merchant_ip_form.status')} required />
          <Controller
            control={control}
            name="status"
            rules={{ required: t('merchant_ip_form.status_required') }}
            render={({ field }) => (
              <Select
                value={field.value ?? ''}
                onChange={(v) => field.onChange(v)}
                options={STATUS_OPTIONS}
                placeholder={t('merchant_ip_form.status_placeholder')}
                triggerClassName="h-11 px-4"
                invalid={!!errors.status}
              />
            )}
          />
          {errors.status && <span className="text-xs text-[#ff4343]">{errors.status.message}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <FieldLabel text={t('merchant_ip_form.comments')} required />
        <Controller
          control={control}
          name="comments"
          rules={{
            required: t('merchant_ip_form.comments_required'),
            maxLength: {
              value: COMMENTS_MAX_LENGTH,
              message: t('merchant_ip_form.comments_too_long'),
            },
          }}
          render={({ field }) => (
            <textarea
              {...field}
              value={field.value ?? ''}
              maxLength={COMMENTS_MAX_LENGTH}
              rows={3}
              className="min-h-24 w-full resize-none rounded-xl border border-[#e5e5e5] bg-white px-4 py-3 text-sm leading-5 text-[#1a1a1a] placeholder:text-[#808080] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7941d]"
              placeholder={t('merchant_ip_form.comments_placeholder')}
            />
          )}
        />
        <span className="text-xs text-[#808080]">{t('merchant_ip_form.comments_hint')}</span>
        {errors.comments && (
          <span className="text-xs text-[#ff4343]">{errors.comments.message}</span>
        )}
      </div>
    </form>
  );
}
