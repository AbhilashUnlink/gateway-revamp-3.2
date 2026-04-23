import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LoginForm, type LoginFormValues } from '@/components/forms/login';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/thunks/authThunks';
import { setAuthData } from '@/store/slices/authSlice';
import { apiService } from '@/utils/apiService';
import { getRedirectPath } from '@/utils/redirectByRole';
import type { ApiResponse, SignInData } from '@/types/login/auth.types';

interface MfaCheckResponse {
  IsMFA: number;
  IsMFAEnabled: number;
  QRCode?: string;
  PrivateKey?: string;
}

function LoginPage() {
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
      setError((err as Error).message ?? 'Something went wrong');
    }
  };

  const handleInternalUser = async (values: LoginFormValues) => {
    const mfaRes = await apiService.auth.checkMfaExist({ username: values.username });
    const mfa = (mfaRes.data as ApiResponse<MfaCheckResponse>).data;

    if (mfa.IsMFA === 0) {
      const genRes = await apiService.auth.postMfaGenerate({
        email: values.username,
        password: values.password,
      });
      const generated = (genRes.data as ApiResponse<{ QRCode: string; PrivateKey: string }>).data;
      localStorage.setItem('PrivateKey', generated.PrivateKey);
      navigate('/mfa-setup', { state: { isMFASetup: false, QRCode: generated.QRCode } });
      return;
    }

    if (mfa.IsMFA === 1 && mfa.IsMFAEnabled === 1) {
      navigate('/mfa-setup', { state: { isMFASetup: true } });
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
      dispatch(setAuthData(userData));
      const redirectPath = getRedirectPath(userData.Groups);
      navigate(redirectPath);
    } else {
      setError((result.payload as string) ?? 'Login failed');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-xl font-semibold text-neutral-700">Sign In</h1>
        <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
      </div>
    </div>
  );
}

export default LoginPage;
