import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { DasIcon } from '@/components/ui/DasIcon';
import { Button } from '@/components/ui/button';

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

interface ForgotPasswordFormValues {
  username: string;
}

interface ForgotPasswordFormProps {
  onSubmit: (values: ForgotPasswordFormValues) => void | Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export function ForgotPasswordForm({ onSubmit, loading, error }: ForgotPasswordFormProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-10">
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <DasIcon
            name="mail"
            className="pointer-events-none absolute left-4 h-5 w-5 shrink-0 text-[#f7941d]"
            aria-hidden="true"
          />
          <Input
            id="username"
            type="text"
            autoComplete="email"
            placeholder={t('forgot_password_form.email_placeholder')}
            className="h-[52px] w-full rounded-lg border border-[#e5e5e5] bg-white pl-12 pr-4 text-sm leading-5 text-neutral-800 placeholder:text-[#808080] outline-none focus:ring-2 focus:ring-[#f7941d]/40 box-border"
            {...register('username', {
              required: t('forgot_password_form.email_required'),
              validate: (val) =>
                emailRegex.test(String(val).toLowerCase()) ||
                t('forgot_password_form.email_invalid'),
            })}
          />
        </div>
        {errors.username ? <p className="text-xs text-red-400">{errors.username.message}</p> : null}
      </div>

      {error ? <p className="text-center text-sm text-red-400">{error}</p> : null}

      <Button type="submit" disabled={loading} variant={'primary'} size={'default'}>
        {loading ? t('forgot_password_form.submitting') : t('forgot_password_form.submit')}
      </Button>
    </form>
  );
}
