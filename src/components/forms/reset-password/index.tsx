import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-[40px]">
      {/* New Password */}
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <Lock
            className="pointer-events-none absolute left-[16px] h-5 w-5 shrink-0 text-[#f7941d]"
            aria-hidden="true"
          />
          <Input
            id="Password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t('reset_password_form.new_password_placeholder')}
            style={{ fontFamily: 'Inter, sans-serif' }}
            className="h-[52px] w-full rounded-[8px] border border-[#e5e5e5] bg-white pl-[48px] pr-[48px] text-[14px] leading-[20px] text-neutral-800 placeholder:text-[#808080] outline-none focus:ring-2 focus:ring-[#f7941d]/40 box-border"
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
            className="absolute right-[16px]"
            aria-label={
              showPassword
                ? t('reset_password_form.hide_password')
                : t('reset_password_form.show_password')
            }
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
        {errors.Password ? (
          <p className="text-[12px] text-red-400">{errors.Password.message}</p>
        ) : null}
      </div>

      {/* Confirm Password */}
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <Lock
            className="pointer-events-none absolute left-[16px] h-5 w-5 shrink-0 text-[#f7941d]"
            aria-hidden="true"
          />
          <Input
            id="ConfirmPassword"
            type={showConfirm ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder={t('reset_password_form.confirm_password_placeholder')}
            style={{ fontFamily: 'Inter, sans-serif' }}
            className="h-[52px] w-full rounded-[8px] border border-[#e5e5e5] bg-white pl-[48px] pr-[48px] text-[14px] leading-[20px] text-neutral-800 placeholder:text-[#808080] outline-none focus:ring-2 focus:ring-[#f7941d]/40 box-border"
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
            className="absolute right-[16px]"
            aria-label={
              showConfirm
                ? t('reset_password_form.hide_password')
                : t('reset_password_form.show_password')
            }
          >
            {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </Button>
        </div>
        {errors.ConfirmPassword ? (
          <p className="text-right text-[12px] text-[#ff6363]">{errors.ConfirmPassword.message}</p>
        ) : null}
      </div>

      {error ? <p className="text-center text-[14px] text-red-400">{error}</p> : null}

      <Button type="submit" disabled={loading} variant={'primary'} size={'default'}>
        {loading ? t('reset_password_form.submitting') : t('reset_password_form.submit')}
      </Button>
    </form>
  );
}
