import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/utils/apiService';
import i18n from '@/i18n';
import { RESET_EMAIL_STORAGE_KEY } from '@/constants/forgot-password';
import { RESET_SUCCESSFUL_ROUTE } from '@/constants/reset-password';

interface ResetPasswordFormValues {
  Password: string;
  ConfirmPassword: string;
}

const useResetPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'otp' | 'password'>('otp');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOtpSubmit = (otpValue: string) => {
    setError(null);
    setOtp(otpValue);
    setStep('password');
  };

  const handleResendOtp = async () => {
    setError(null);
    try {
      const username = sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY);
      await apiService.auth.postForgotPassword({ username });
    } catch (err) {
      setError((err as Error).message ?? i18n.t('reset_password.something_went_wrong'));
    }
  };

  const handlePasswordSubmit = async (values: ResetPasswordFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const username = sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY);
      await apiService.auth.postForgotPasswordVerify({
        username,
        Code: otp,
        Password: values.Password,
        ConfirmPassword: values.ConfirmPassword,
      });
      sessionStorage.removeItem(RESET_EMAIL_STORAGE_KEY);
      navigate(RESET_SUCCESSFUL_ROUTE);
    } catch (err) {
      setError((err as Error).message ?? i18n.t('reset_password.something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

  return { step, handleOtpSubmit, handleResendOtp, handlePasswordSubmit, loading, error };
};

export default useResetPassword;
