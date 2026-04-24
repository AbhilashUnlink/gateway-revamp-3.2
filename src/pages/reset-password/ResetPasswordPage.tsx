import { useTranslation } from 'react-i18next';
import AuthLayout from '@/components/ui/auth-layout';
import AuthHeading from '@/components/ui/auth-heading';
import { DasLink } from '@/components/ui/das-link';
import LanguageSelect from '@/components/language-select/language-select';
import { ResetPasswordOtpForm } from '@/components/forms/reset-password-otp';
import { ResetPasswordForm } from '@/components/forms/reset-password';
import useResetPassword from '@/hooks/reset-password/useResetPassword';

function ResetPasswordPage() {
  const { t } = useTranslation();
  const { step, handleOtpSubmit, handleResendOtp, handlePasswordSubmit, loading, error } =
    useResetPassword();

  return (
    <AuthLayout>
      {/* Header row: back link + language selector */}
      <div className="flex h-11 items-center justify-between">
        <DasLink to="/login">{t('reset_password.back_to_sign_in')}</DasLink>
        <div className="relative inline-flex items-center">
          <LanguageSelect />
        </div>
      </div>

      {step === 'otp' ? (
        <div className="flex flex-col gap-10">
          <AuthHeading>
            <AuthHeading.Title>{t('reset_password_otp.heading')}</AuthHeading.Title>
            <AuthHeading.Description>{t('reset_password_otp.description')}</AuthHeading.Description>
          </AuthHeading>
          <ResetPasswordOtpForm
            onSubmit={handleOtpSubmit}
            onResend={handleResendOtp}
            error={error}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-10">
          <AuthHeading.Title className="font-medium">
            {t('reset_password.heading')}
          </AuthHeading.Title>
          <ResetPasswordForm onSubmit={handlePasswordSubmit} loading={loading} error={error} />
        </div>
      )}
    </AuthLayout>
  );
}

export default ResetPasswordPage;
