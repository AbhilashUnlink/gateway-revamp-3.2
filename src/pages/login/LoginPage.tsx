import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoginForm, type LoginFormValues } from '@/components/forms/login';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginUser } from '@/store/thunks/authThunks';
import { apiService } from '@/utils/apiService';
import { getRedirectPath } from '@/utils/redirectByRole';
import type { ApiResponse, SignInData } from '@/types/login/auth.types';
import heroImg from '@/assets/hero.png';
import { Globe, ChevronDown, CheckCircle } from 'lucide-react';

interface MfaCheckResponse {
  IsMFA: number;
  IsMFAEnabled: number;
  QRCode?: string;
  PrivateKey?: string;
}

function PaymentOptionsLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="18" cy="18" r="18" fill="#f5a623" />
        <path
          d="M10 22c2-4 4-8 8-8s6 4 8 8"
          stroke="#fff"
          strokeWidth="2.2"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M18 14c0-2.5 1.5-4 3-4s3 1.5 3 4-1.5 4-3 4"
          stroke="#fff"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="text-lg font-bold text-white tracking-wide">Payment Options</span>
    </div>
  );
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
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left hero panel */}
      <div className="relative hidden h-full w-1/2 overflow-hidden lg:flex lg:flex-col lg:items-center lg:justify-center">
        <img
          src={heroImg}
          alt="Payment solutions hero"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.6) 100%)',
          }}
        />

        <div className="relative z-10 px-12 text-center">
          <h2
            className="mb-4 font-bold leading-tight text-[#f5a623]"
            style={{ fontSize: '42px', letterSpacing: '-0.5px' }}
          >
            Simplifying
            <br />
            Payments
          </h2>
          <p className="mx-auto max-w-xs text-sm leading-relaxed text-neutral-300">
            All-in-one digital payment solutions provider, built to accelerate your business growth.
          </p>
        </div>

        {/* Carousel pagination dots — bottom-center */}
        <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 items-center gap-2">
          <span className="h-2 w-6 rounded-full bg-[#f5a623]" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
          <span className="h-2 w-2 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Right dark panel */}
      <div
        className="flex h-full w-full flex-col items-center justify-center px-6 py-10 lg:w-1/2"
        style={{ background: '#2d2d2d' }}
      >
        {/* Success toast — top-center of right panel */}
        {successMessage && toastVisible && (
          <div className="mb-6 flex items-center gap-2 rounded-full border border-green-500 bg-green-900/40 px-5 py-2.5">
            <CheckCircle className="h-4 w-4 shrink-0 text-green-400" />
            <span className="text-sm font-medium text-green-300">{successMessage}</span>
            <button
              type="button"
              onClick={() => setToastVisible(false)}
              className="ml-2 text-green-400 hover:text-green-200"
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* Logo above card */}
        <div className="mb-6">
          <PaymentOptionsLogo />
        </div>

        {/* Sign-in card */}
        <div className="w-full max-w-md rounded-xl p-8" style={{ background: '#3a3a3a' }}>
          {/* Language selector — top-right of card */}
          <div className="mb-5 flex items-center justify-end gap-1">
            <Globe className="h-3.5 w-3.5 text-neutral-400" />
            <span className="text-xs text-neutral-400">English (UK)</span>
            <ChevronDown className="h-3.5 w-3.5 text-neutral-400" />
          </div>

          <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
