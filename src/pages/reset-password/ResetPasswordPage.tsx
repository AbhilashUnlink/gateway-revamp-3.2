import { useTranslation } from 'react-i18next';
import AuthLayout from '@/components/ui/auth-layout';
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
      <div className="flex h-[44px] items-center justify-between">
        <DasLink to="/login">{t('reset_password.back_to_sign_in')}</DasLink>
        <div className="relative inline-flex items-center">
          <LanguageSelect />
        </div>
      </div>

      {step === 'otp' ? (
        <div className="flex flex-col gap-[40px]">
          <div className="flex flex-col gap-[12px]">
            <p
              className="font-semibold text-[24px] leading-normal text-white"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {t('reset_password_otp.heading')}
            </p>
            <p
              className="text-[14px] leading-[20px] text-white"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {t('reset_password_otp.description')}
            </p>
          </div>
          <ResetPasswordOtpForm
            onSubmit={handleOtpSubmit}
            onResend={handleResendOtp}
            error={error}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-[40px]">
          <p
            className="font-medium text-[24px] leading-normal text-white"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            {t('reset_password.heading')}
          </p>
          <ResetPasswordForm onSubmit={handlePasswordSubmit} loading={loading} error={error} />
        </div>
      )}
    </AuthLayout>
  );
}

export default ResetPasswordPage;
