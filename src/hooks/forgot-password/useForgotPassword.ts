import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '@/utils/apiService';
import i18n from '@/i18n';
import { RESET_EMAIL_STORAGE_KEY } from '@/constants/forgot-password';

interface ForgotPasswordFormValues {
  username: string;
}

const useForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: ForgotPasswordFormValues) => {
    setError(null);
    setLoading(true);
    try {
      await apiService.auth.postForgotPassword({ username: values.username });
      sessionStorage.setItem(RESET_EMAIL_STORAGE_KEY, values.username);
      navigate('/reset-password');
    } catch (err) {
      setError((err as Error).message ?? i18n.t('forgot_password.something_went_wrong'));
    } finally {
      setLoading(false);
    }
  };

  return { handleSubmit, loading, error };
};

export default useForgotPassword;
