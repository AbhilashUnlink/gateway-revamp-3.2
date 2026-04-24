import { useTranslation } from 'react-i18next';
import AuthLayout from '@/components/ui/auth-layout';
import AuthHeading from '@/components/ui/auth-heading';
import { DasLink } from '@/components/ui/das-link';
import LanguageSelect from '@/components/language-select/language-select';
import { ForgotPasswordForm } from '@/components/forms/forgot-password';
import useForgotPassword from '@/hooks/forgot-password/useForgotPassword';

function ForgotPasswordPage() {
  const { t } = useTranslation();
  const { handleSubmit, loading, error } = useForgotPassword();

  return (
    <AuthLayout>
      {/* Header row: back link + language selector */}
      <div className="flex h-11 items-center justify-between">
        <DasLink to="/login">{t('forgot_password.back_to_sign_in')}</DasLink>
        <div className="relative inline-flex items-center">
          <LanguageSelect />
        </div>
      </div>

      {/* Heading + description + form */}
      <div className="flex flex-col gap-10">
        <AuthHeading>
          <AuthHeading.Title>{t('forgot_password.heading')}</AuthHeading.Title>
          <AuthHeading.Description>{t('forgot_password.description')}</AuthHeading.Description>
        </AuthHeading>

        <ForgotPasswordForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
