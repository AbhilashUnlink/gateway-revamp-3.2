import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { DasIcon } from '@/components/ui/das-icon';
import { Button } from '@/components/ui/button';
import { PASSWORD_VALIDATION_PATTERN } from '@/constants/reset-password';

interface ResetPasswordFormValues {
  Password: string;
  ConfirmPassword: string;
}

interface ResetPasswordFormProps {
  onSubmit: (values: ResetPasswordFormValues) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function ResetPasswordForm({ onSubmit, loading, error }: ResetPasswordFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
      {/* New Password */}
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <DasIcon
            name="lock"
            className="pointer-events-none absolute left-4 h-5 w-5 shrink-0 text-[#f7941d]"
            aria-hidden="true"
          />
          <Input
            id="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t('reset_password_form.new_password_placeholder')}
            className="h-[52px] w-full rounded-lg border border-[#e5e5e5] bg-white pl-12 pr-12 text-sm leading-5 text-neutral-800 placeholder:text-[#808080] outline-none focus:ring-2 focus:ring-[#f7941d]/40 box-border"
            {...register('Password', {
              required: t('reset_password_form.password_required'),
              minLength: {
                value: 14,
                message: t('reset_password_form.password_too_short'),
              },
              pattern: {
                value: PASSWORD_VALIDATION_PATTERN,
                message: t('reset_password_form.password_complexity'),
              },
            })}
          />
          <Button
            type="button"
            variant={'link'}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-4"
            aria-label={
              showPassword
                ? t('reset_password_form.hide_password')
                : t('reset_password_form.show_password')
            }
          >
            {showPassword ? (
              <DasIcon name="eye-off" className="h-5 w-5" />
            ) : (
              <DasIcon name="eye" className="h-5 w-5" />
            )}
          </Button>
        </div>
        {errors.Password ? <p className="text-xs text-red-400">{errors.Password.message}</p> : null}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <DasIcon
            name="lock"
            className="pointer-events-none absolute left-4 h-5 w-5 shrink-0 text-[#f7941d]"
            aria-hidden="true"
          />
          <Input
            id="ConfirmPassword"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t('reset_password_form.confirm_password_placeholder')}
            className="h-[52px] w-full rounded-lg border border-[#e5e5e5] bg-white pl-12 pr-12 text-sm leading-5 text-neutral-800 placeholder:text-[#808080] outline-none focus:ring-2 focus:ring-[#f7941d]/40 box-border"
            {...register('ConfirmPassword', {
              required: t('reset_password_form.password_required'),
              validate: (val) =>
                val === watch('Password') || t('reset_password_form.passwords_must_match'),
            })}
          />
          <Button
            type="button"
            variant={'link'}
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-4"
            aria-label={
              showConfirm
                ? t('reset_password_form.hide_password')
                : t('reset_password_form.show_password')
            }
          >
            {showConfirm ? (
              <DasIcon name="eye-off" className="h-5 w-5" />
            ) : (
              <DasIcon name="eye" className="h-5 w-5" />
            )}
          </Button>
        </div>
        {errors.ConfirmPassword ? (
          <p className="text-right text-xs text-[#ff6363]">{errors.ConfirmPassword.message}</p>
        ) : null}
      </div>

      {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}

      <Button type="submit" disabled={loading} variant={'primary'} size={'default'}>
        {loading ? t('reset_password_form.submitting') : t('reset_password_form.submit')}
      </Button>
    </form>
  );
}
