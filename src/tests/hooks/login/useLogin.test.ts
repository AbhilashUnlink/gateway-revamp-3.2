import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useLogin from '@/hooks/login/useLogin';
import { apiService } from '@/utils/apiService';
import { getRedirectPath } from '@/utils/redirectByRole';
import { AxiosHeaders } from 'axios';

const mockNavigate = vi.fn();
const mockDispatch = vi.fn();
const mockToast = vi.hoisted(() => ({ error: vi.fn(), success: vi.fn(), info: vi.fn() }));
// vi.hoisted ensures this complex mock is available when vi.mock factories run
const mockLoginUser = vi.hoisted(() => Object.assign(vi.fn(), { fulfilled: { match: vi.fn() } }));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
  useAppSelector: () => false, // loading = false
}));

vi.mock('@/utils/apiService', () => ({
  apiService: {
    auth: {
      checkMfaExist: vi.fn(),
      mfaGenerate: vi.fn(),
    },
  },
}));

vi.mock('@/store/thunks/authThunks', () => ({
  loginUser: mockLoginUser,
}));

vi.mock('@/utils/redirectByRole', () => ({
  getRedirectPath: vi.fn(),
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => mockToast,
}));

vi.mock('@/i18n', () => ({
  default: { t: (key: string) => key },
}));

describe('useLogin', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    mockDispatch.mockClear();
    mockLoginUser.mockClear();
    mockLoginUser.fulfilled.match.mockClear();
    mockToast.error.mockClear();
    mockToast.success.mockClear();
    mockToast.info.mockClear();
    vi.mocked(apiService.auth.checkMfaExist).mockClear();
    vi.mocked(apiService.auth.mfaGenerate).mockClear();
    vi.mocked(getRedirectPath).mockReturnValue('/dashboard');
    localStorage.clear();
  });

  it('calls dispatch with loginUser for an external user (no MFA check)', async () => {
    mockDispatch.mockResolvedValue({ payload: { Groups: [] } });
    mockLoginUser.fulfilled.match.mockReturnValue(true);

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.handleSubmit({ username: 'ext@example.com', password: 'pass' });
    });

    expect(apiService.auth.checkMfaExist).not.toHaveBeenCalled();
    expect(mockDispatch).toHaveBeenCalled();
  });

  it('navigates to the redirect path on successful login', async () => {
    mockDispatch.mockResolvedValue({ payload: { Groups: ['SYSADMIN'] } });
    mockLoginUser.fulfilled.match.mockReturnValue(true);
    vi.mocked(getRedirectPath).mockReturnValue('/admin');

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com', password: 'pass' });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/admin');
  });

  it('surfaces the rejected payload via toast.error on login failure', async () => {
    mockDispatch.mockResolvedValue({ payload: 'Invalid credentials' });
    mockLoginUser.fulfilled.match.mockReturnValue(false);

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com', password: 'wrong' });
    });

    expect(mockToast.error).toHaveBeenCalledWith('Invalid credentials');
  });

  it('does not call toast.error on a successful subsequent submit', async () => {
    mockDispatch
      .mockResolvedValueOnce({ payload: 'Error' })
      .mockResolvedValueOnce({ payload: { Groups: [] } });
    mockLoginUser.fulfilled.match.mockReturnValueOnce(false).mockReturnValueOnce(true);

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com', password: 'pass' });
    });
    expect(mockToast.error).toHaveBeenCalledWith('Error');

    mockToast.error.mockClear();
    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com', password: 'pass' });
    });
    expect(mockToast.error).not.toHaveBeenCalled();
  });

  it('checks MFA for internal user (@paymentoptions.com)', async () => {
    vi.mocked(apiService.auth.checkMfaExist).mockResolvedValue({
      data: { data: { IsMFA: 1, IsMFAEnabled: 1 } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    });

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.handleSubmit({
        username: 'internal@paymentoptions.com',
        password: 'pass',
      });
    });

    expect(apiService.auth.checkMfaExist).toHaveBeenCalledWith({
      username: 'internal@paymentoptions.com',
      password: 'pass',
    });
  });

  it('navigates to /mfa-setup with isMFASetup=true when IsMFA=1 and IsMFAEnabled=1', async () => {
    vi.mocked(apiService.auth.checkMfaExist).mockResolvedValue({
      data: { data: { IsMFA: 1, IsMFAEnabled: 1 } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    });
    const creds = { username: 'internal@paymentoptions.com', password: 'pass' };

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.handleSubmit(creds);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/mfa-setup', {
      state: { isMFASetup: true, credentials: creds },
    });
  });

  it('calls mfaGenerate and navigates to /mfa-setup with isMFASetup=false when IsMFA=0', async () => {
    vi.mocked(apiService.auth.checkMfaExist).mockResolvedValue({
      data: { data: { IsMFA: 0, IsMFAEnabled: 0 } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    });
    vi.mocked(apiService.auth.mfaGenerate).mockResolvedValue({
      data: { data: { QRCode: 'qr123', PrivateKey: 'pk123' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {
        headers: new AxiosHeaders(),
      },
    });
    const creds = { username: 'internal@paymentoptions.com', password: 'pass' };

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.handleSubmit(creds);
    });

    expect(apiService.auth.mfaGenerate).toHaveBeenCalledWith({
      Email: 'internal@paymentoptions.com',
      Password: 'pass',
      path: 'DASPOS',
    });
    expect(localStorage.getItem('PrivateKey')).toBe('pk123');
    expect(mockNavigate).toHaveBeenCalledWith('/mfa-setup', {
      state: { isMFASetup: false, QRCode: 'qr123', credentials: creds },
    });
  });

  it('shows toast.error with the thrown message when an API call throws', async () => {
    vi.mocked(apiService.auth.checkMfaExist).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLogin());
    await act(async () => {
      await result.current.handleSubmit({
        username: 'internal@paymentoptions.com',
        password: 'pass',
      });
    });

    expect(mockToast.error).toHaveBeenCalledWith('Network error');
  });
});
