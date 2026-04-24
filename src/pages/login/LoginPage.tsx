import { useTranslation } from 'react-i18next';
import AuthLayout from '@/components/ui/auth-layout';
import { DasLink } from '@/components/ui/das-link';
import LanguageSelect from '@/components/language-select/language-select';
import { LoginForm } from '@/components/forms/login';
import useLogin from '@/hooks/login/useLogin';

function LoginPage() {
  const { t } = useTranslation();
  const { handleSubmit, error, loading } = useLogin();

  return (
    <AuthLayout>
      {/* Language selector row */}
      <div className="flex h-11 items-center justify-end gap-2.5">
        <div className="relative inline-flex items-center">
          <LanguageSelect />
        </div>
      </div>

      {/* Heading + form */}
      <div className="flex flex-col gap-10">
        <p
          className="font-semibold text-[24px] leading-normal"
          style={{ color: '#ffffff', fontFamily: 'Inter, sans-serif' }}
        >
          {t('login.sign_in_to')}{' '}
          <span
            className="font-bold text-[28px]"
            style={{ color: '#f7941d', fontFamily: 'Inter, sans-serif' }}
          >
            {t('login.payment_options')}
          </span>
        </p>

        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>

      {/* Footer links */}
      <div className="flex items-center justify-between">
        <DasLink to="/forgot-password">{t('login.forgot_password')}</DasLink>
        <DasLink to="/choose-account-type">{t('login.create_an_account')}</DasLink>
      </div>
    </AuthLayout>
  );
}

export default LoginPage;
