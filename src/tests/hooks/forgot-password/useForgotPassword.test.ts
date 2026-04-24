import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import useForgotPassword from '@/hooks/forgot-password/useForgotPassword';
import { apiService } from '@/utils/apiService';
import { RESET_EMAIL_STORAGE_KEY } from '@/constants/forgot-password';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/utils/apiService', () => ({
  apiService: {
    auth: {
      postForgotPassword: vi.fn(),
    },
  },
}));

vi.mock('@/i18n', () => ({
  default: { t: (key: string) => key },
}));

describe('useForgotPassword', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(apiService.auth.postForgotPassword).mockClear();
    sessionStorage.clear();
  });

  it('calls postForgotPassword with the provided username', async () => {
    vi.mocked(apiService.auth.postForgotPassword).mockResolvedValue({});
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com' });
    });

    expect(apiService.auth.postForgotPassword).toHaveBeenCalledWith({
      username: 'user@example.com',
    });
  });

  it('stores email in sessionStorage on success', async () => {
    vi.mocked(apiService.auth.postForgotPassword).mockResolvedValue({});
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com' });
    });

    expect(sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY)).toBe('user@example.com');
  });

  it('navigates to /reset-password on success', async () => {
    vi.mocked(apiService.auth.postForgotPassword).mockResolvedValue({});
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com' });
    });

    expect(mockNavigate).toHaveBeenCalledWith('/reset-password');
  });

  it('sets loading=true while the request is in flight', async () => {
    let resolve!: (v: unknown) => void;
    vi.mocked(apiService.auth.postForgotPassword).mockReturnValue(
      new Promise((res) => {
        resolve = res;
      })
    );

    const { result } = renderHook(() => useForgotPassword());

    act(() => {
      void result.current.handleSubmit({ username: 'user@example.com' });
    });
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve({});
    });
    expect(result.current.loading).toBe(false);
  });

  it('sets error message on API failure', async () => {
    vi.mocked(apiService.auth.postForgotPassword).mockRejectedValue(new Error('User not found'));
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.handleSubmit({ username: 'notfound@example.com' });
    });

    expect(result.current.error).toBe('User not found');
    expect(result.current.loading).toBe(false);
  });

  it('does not navigate or store email on API failure', async () => {
    vi.mocked(apiService.auth.postForgotPassword).mockRejectedValue(new Error('err'));
    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com' });
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(sessionStorage.getItem(RESET_EMAIL_STORAGE_KEY)).toBeNull();
  });

  it('clears previous error on a new submit', async () => {
    vi.mocked(apiService.auth.postForgotPassword)
      .mockRejectedValueOnce(new Error('First error'))
      .mockResolvedValueOnce({});

    const { result } = renderHook(() => useForgotPassword());

    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com' });
    });
    expect(result.current.error).toBe('First error');

    await act(async () => {
      await result.current.handleSubmit({ username: 'user@example.com' });
    });
    expect(result.current.error).toBeNull();
  });
});
