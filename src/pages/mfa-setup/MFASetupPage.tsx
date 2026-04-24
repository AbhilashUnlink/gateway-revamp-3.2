import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/store/hooks';
import { loginUser } from '@/store/thunks/authThunks';
import { getRedirectPath } from '@/utils/redirectByRole';
import type { LoginFormValues, SignInData } from '@/types/login/auth.types';

interface MFASetupState {
  isMFASetup: boolean;
  QRCode?: string;
  credentials?: LoginFormValues;
}

function MFASetupPage() {
  const { state } = useLocation() as { state: MFASetupState | null };
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSkip = async () => {
    if (!state?.credentials) {
      setError('No credentials available. Please log in again.');
      return;
    }

    setLoading(true);
    setError(null);

    const result = await dispatch(loginUser(state.credentials));

    if (loginUser.fulfilled.match(result)) {
      const userData = result.payload as SignInData;
      navigate(getRedirectPath(userData.Groups));
    } else {
      setError((result.payload as string) ?? 'Sign in failed');
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <h1 className="text-xl font-semibold text-neutral-700">MFA Setup</h1>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <Button variant="link" onClick={handleSkip} disabled={loading}>
          {loading ? 'Signing in…' : 'Skip'}
        </Button>
      </div>
    </div>
  );
}

export default MFASetupPage;
