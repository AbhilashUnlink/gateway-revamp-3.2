import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useResetPassword from '@/hooks/reset-password/useResetPassword';
import { apiService } from '@/utils/apiService';
import { RESET_EMAIL_STORAGE_KEY } from '@/constants/forgot-password';
import { RESET_SUCCESSFUL_ROUTE } from '@/constants/reset-password';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/utils/apiService', () => ({
  apiService: {
    auth: {
      postForgotPassword: vi.fn(),
      postForgotPasswordVerify: vi.fn(),
    },
  },
}));

vi.mock('@/i18n', () => ({
  default: { t: (key: string) => key },
}));

const VALID_PASSWORD = 'ValidPass1!@#Test';

describe('useResetPassword', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(apiService.auth.postForgotPassword).mockClear();
    vi.mocked(apiService.auth.postForgotPasswordVerify).mockClear();
    sessionStorage.clear();
    sessionStorage.setItem(RESET_EMAIL_STORAGE_KEY, 'user@example.com');
  });

  // ─── handleOtpSubmit ───────────────────────────────────────────────────────

  describe('handleOtpSubmit', () => {
    it('starts in otp step', () => {
      const { result } = renderHook(() => useResetPassword());
      expect(result.current.step).toBe('otp');
    });

    it('advances step to password', () => {
      const { result } = renderHook(() => useResetPassword());
      act(() => {
        result.current.handleOtpSubmit('123456');
      });
      expect(result.current.step).toBe('password');
    });

    it('clears any existing error', async () => {
      vi.mocked(apiService.auth.postForgotPassword).mockRejectedValueOnce(new Error('err'));
      const { result } = renderHook(() => useResetPassword());

      await act(async () => {
        await result.current.handleResendOtp();
      });
      expect(result.current.error).toBe('err');

      act(() => {
        result.current.handleOtpSubmit('123456');
      });
      expect(result.current.error).toBeNull();
    });
  });

  // ─── handleResendOtp ───────────────────────────────────────────────────────

  describe('handleResendOtp', () => {
    it('calls postForgotPassword with email from sessionStorage', async () => {
      vi.mocked(apiService.auth.postForgotPassword).mockResolvedValue({});
      const { result } = renderHook(() => useResetPassword());

      await act(async () => {
        await result.current.handleResendOtp();
      });

      expect(apiService.auth.postForgotPassword).toHaveBeenCalledWith({
        username: 'user@example.com',
      });
    });

    it('sets error on API failure', async () => {
      vi.mocked(apiService.auth.postForgotPassword).mockRejectedValue(new Error('Resend failed'));
      const { result } = renderHook(() => useResetPassword());

      await act(async () => {
        await result.current.handleResendOtp();
      });

      expect(result.current.error).toBe('Resend failed');
    });
  });

  // ─── handlePasswordSubmit ──────────────────────────────────────────────────

  describe('handlePasswordSubmit', () => {
    it('calls postForgotPasswordVerify with the OTP submitted in the previous step', async () => {
      vi.mocked(apiService.auth.postForgotPasswordVerify).mockResolvedValue({});
      const { result } = renderHook(() => useResetPassword());

      act(() => {
        result.current.handleOtpSubmit('654321');
      });
      await act(async () => {
        await result.current.handlePasswordSubmit({
          Password: VALID_PASSWORD,
          ConfirmPassword: VALID_PASSWORD,
        });
      });

      expect(apiService.auth.postForgotPasswordVerify).toHaveBeenCalledWith({
        username: 'user@example.com',
        Code: '654321',
        Password: VALID_PASSWORD,
        ConfirmPassword: VALID_PASSWORD,
      });
    });

    it('navigates to reset-successful on success', async () => {
      vi.mocked(apiService.auth.postForgotPasswordVerify).mockResolvedValue({});
      const { result } = renderHook(() => useResetPassword());

      act(() => {
        result.current.handleOtpSubmit('123456');
      });
      await act(async () => {
        await result.current.handlePasswordSubmit({
          Password: VALID_PASSWORD,
          ConfirmPassword: VALID_PASSWORD,
        });
      });

      expect(mockNavigate).toHaveBeenCalledWith(RESET_SUCCESSFUL_ROUTE);
    });

    it('removes email from sessionStorage on success', async () => {
      vi.mocked(apiService.auth.postForgotPasswordVerify).mockResolvedValue({});
      const { result } = renderHook(() => useResetPassword());

      act(() => {
        result.current.handleOtpSubmit('123456');
      });
      await act(async () => {
        await result.current.handlePasswordSubmit({
          Password: VALID_PASSWORD,
          ConfirmPassword: VALID_PASSWORD,
        });
      });

      expect(sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY)).toBeNull();
    });

    it('sets error on API failure', async () => {
      vi.mocked(apiService.auth.postForgotPasswordVerify).mockRejectedValue(
        new Error('Invalid code')
      );
      const { result } = renderHook(() => useResetPassword());

      act(() => {
        result.current.handleOtpSubmit('123456');
      });
      await act(async () => {
        await result.current.handlePasswordSubmit({
          Password: VALID_PASSWORD,
          ConfirmPassword: VALID_PASSWORD,
        });
      });

      expect(result.current.error).toBe('Invalid code');
    });

    it('does not navigate or clear sessionStorage on failure', async () => {
      vi.mocked(apiService.auth.postForgotPasswordVerify).mockRejectedValue(new Error('err'));
      const { result } = renderHook(() => useResetPassword());

      act(() => {
        result.current.handleOtpSubmit('123456');
      });
      await act(async () => {
        await result.current.handlePasswordSubmit({
          Password: VALID_PASSWORD,
          ConfirmPassword: VALID_PASSWORD,
        });
      });

      expect(mockNavigate).not.toHaveBeenCalled();
      expect(sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY)).toBe('user@example.com');
    });

    it('sets loading=true during request and false after', async () => {
      let resolve!: (v: unknown) => void;
      vi.mocked(apiService.auth.postForgotPasswordVerify).mockReturnValue(
        new Promise((res) => {
          resolve = res;
        })
      );

      const { result } = renderHook(() => useResetPassword());

      act(() => {
        result.current.handleOtpSubmit('123456');
      });

      act(() => {
        void result.current.handlePasswordSubmit({
          Password: VALID_PASSWORD,
          ConfirmPassword: VALID_PASSWORD,
        });
      });
      expect(result.current.loading).toBe(true);

      await act(async () => {
        resolve({});
      });
      expect(result.current.loading).toBe(false);
    });
  });
});
