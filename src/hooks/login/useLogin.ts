import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import i18n from '@/i18n';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/thunks/authThunks';
import { apiService } from '@/utils/apiService';
import { getRedirectPath } from '@/utils/redirectByRole';
import type {
  ApiResponse,
  LoginFormValues,
  MfaCheckResponse,
  SignInData,
} from '@/types/login/auth.types';

const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loading = useAppSelector((s) => s.auth.loading);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (values: LoginFormValues) => {
    setError(null);
    const isInternalUser = values.username?.includes('@paymentoptions.com');

    try {
      if (isInternalUser) {
        await handleInternalUser(values);
      } else {
        await handleExternalUser(values);
      }
    } catch (err) {
      setError((err as Error).message ?? i18n.t('login.something_went_wrong'));
    }
  };

  const handleInternalUser = async (values: LoginFormValues) => {
    const mfaRes = await apiService.auth.checkMfaExist({
      username: values.username,
      password: values.password,
    });
    const mfa = (mfaRes.data as ApiResponse<MfaCheckResponse>).data;

    if (mfa.IsMFA === 0) {
      const genRes = await apiService.auth.mfaGenerate({
        Email: values.username,
        Password: values.password,
        path: 'DASPOS',
      });
      const generated = (genRes.data as ApiResponse<{ QRCode: string; PrivateKey: string }>).data;
      localStorage.setItem('PrivateKey', generated.PrivateKey);
      navigate('/mfa-setup', {
        state: { isMFASetup: false, QRCode: generated.QRCode, credentials: values },
      });
      return;
    }

    if (mfa.IsMFA === 1 && mfa.IsMFAEnabled === 1) {
      navigate('/mfa-setup', { state: { isMFASetup: true, credentials: values } });
      return;
    }

    await performSignIn(values);
  };

  const handleExternalUser = async (values: LoginFormValues) => {
    await performSignIn(values);
  };

  const performSignIn = async (values: LoginFormValues) => {
    const result = await dispatch(
      loginUser({ username: values.username, password: values.password })
    );

    if (loginUser.fulfilled.match(result)) {
      const userData = result.payload as SignInData;
      const redirectPath = getRedirectPath(userData.Groups);
      navigate(redirectPath);
    } else {
      setError((result.payload as string) ?? i18n.t('login.login_failed'));
    }
  };
  return {
    loading,
    error,
    handleSubmit,
  };
};

export default useLogin;
