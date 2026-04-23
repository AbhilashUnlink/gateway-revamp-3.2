import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm, type LoginFormValues } from '@/components/forms/login';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/thunks/authThunks';
import { apiService } from '@/utils/apiService';
import { getRedirectPath } from '@/utils/redirectByRole';
import type { ApiResponse, SignInData } from '@/types/login/auth.types';
import heroImg from '@/assets/hero.png';
import { Globe, ChevronDown, X } from 'lucide-react';

interface MfaCheckResponse {
  IsMFA: number;
  IsMFAEnabled: number;
  QRCode?: string;
  PrivateKey?: string;
}

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const loading = useAppSelector((s) => s.auth.loading);
  const [error, setError] = useState<string | null>(null);
  const [toastVisible, setToastVisible] = useState(true);

  const successMessage = (location.state as { successMessage?: string } | null)?.successMessage;

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
      setError((result.payload as string) ?? 'Login failed');
    }
  };

  return (
    <div
      className="relative flex h-screen w-screen overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #FDEBCA 0%, #F4EAD8 50%, #FFFBF1 100%)' }}
    >
      {/* Success toast */}
      {successMessage && toastVisible && (
        <div className="fixed right-6 top-6 z-[400] flex items-center gap-3 rounded-xl border border-[#1E8F1F] bg-[#C6F3DA] px-4 py-3 shadow-elevated">
          <span className="text-sm font-medium text-[#1E8F1F]">{successMessage}</span>
          <button
            type="button"
            onClick={() => setToastVisible(false)}
            className="ml-2 text-[#1E8F1F] hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Left hero panel */}
      <div className="relative hidden h-full w-1/2 overflow-hidden lg:flex lg:flex-col lg:justify-end">
        <img
          src={heroImg}
          alt="Payment solutions hero"
          className="absolute inset-0 h-full w-full object-cover mix-blend-multiply"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(160deg, rgba(247,148,29,0.35) 0%, rgba(20,20,40,0.65) 100%)',
          }}
        />

        <div className="relative z-10 p-12 pb-14 text-right">
          <h2
            className="mb-4 font-bold leading-tight text-white"
            style={{ fontSize: '40px', letterSpacing: '-0.5px' }}
          >
            Simplifying
            <br />
            Payments
          </h2>
          <p className="ml-auto max-w-xs text-sm leading-relaxed text-white/80">
            All-in-one digital payment solutions provider, built to accelerate your business growth.
          </p>

          {/* Carousel pagination dots */}
          <div className="mt-8 flex items-center justify-end gap-2">
            <span className="h-2 w-6 rounded-full bg-[#F7941D]" />
            <span className="h-2 w-2 rounded-full bg-[#D9D9D9]" />
            <span className="h-2 w-2 rounded-full bg-[#D9D9D9]" />
          </div>
        </div>
      </div>

      {/* Right login panel */}
      <div className="flex h-full w-full flex-col items-center justify-center px-6 py-8 lg:w-1/2">
        {/* Header: language selector */}
        <div className="mb-6 flex w-full max-w-md items-center justify-end gap-1.5">
          <Globe className="h-4 w-4 text-neutral-500" />
          <span className="text-sm text-neutral-600">English (UK)</span>
          <ChevronDown className="h-4 w-4 text-neutral-500" />
        </div>

        {/* Glassmorphism card */}
        <div
          className="w-full max-w-md rounded-[24px] p-8"
          style={{
            background:
              'linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(7.5px)',
            WebkitBackdropFilter: 'blur(7.5px)',
            boxShadow:
              '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)',
          }}
        >
          <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
