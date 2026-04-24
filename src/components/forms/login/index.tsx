import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { LoginFormValues } from '@/types/login/auth.types';

interface LoginFormProps {
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export function LoginForm({ onSubmit, loading, error }: LoginFormProps) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>();

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-[40px]">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center">
            <Mail
              className="pointer-events-none absolute left-[16px] h-5 w-5 shrink-0 text-[#f7941d]"
              aria-hidden="true"
            />
            <Input
              id="username"
              type="text"
              autoComplete="email"
              placeholder={t('login_form.email_placeholder')}
              style={{ fontFamily: 'Inter, sans-serif' }}
              className="h-[52px] w-full rounded-[8px] border border-[#e5e5e5] bg-white pl-[48px] pr-[16px] text-[14px] leading-[20px] text-neutral-800 placeholder:text-[#808080] outline-none focus:ring-2 focus:ring-[#f7941d]/40 box-border"
              {...register('username', {
                required: t('login_form.email_required'),
                validate: (val) =>
                  emailRegex.test(String(val).toLowerCase()) || t('login_form.email_invalid'),
              })}
            />
          </div>
          {errors.username ? (
            <p className="text-[12px] text-red-400">{errors.username.message}</p>
          ) : null}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center">
            <Lock
              className="pointer-events-none absolute left-[16px] h-5 w-5 shrink-0 text-[#f7941d]"
              aria-hidden="true"
            />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder={t('login_form.password_placeholder')}
              style={{ fontFamily: 'Inter, sans-serif' }}
              className="h-[52px] w-full rounded-[8px] border border-[#e5e5e5] bg-white pl-[48px] pr-[48px] text-[14px] leading-[20px] text-neutral-800 placeholder:text-[#808080] outline-none focus:ring-2 focus:ring-[#f7941d]/40 box-border"
              {...register('password', {
                required: t('login_form.password_required'),
              })}
            />
            <Button
              type="button"
              variant={'link'}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-[16px]"
              aria-label={
                showPassword ? t('login_form.hide_password') : t('login_form.show_password')
              }
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          </div>
          {errors.password ? (
            <p className="text-[12px] text-red-400">{errors.password.message}</p>
          ) : null}
        </div>

        {error ? <p className="text-center text-[14px] text-red-400">{error}</p> : null}

        {/* Submit */}
        <Button type="submit" disabled={loading} variant={'primary'} size={'default'}>
          {loading ? t('login_form.submitting') : t('login_form.submit')}
        </Button>
      </form>
    </>
  );
}
