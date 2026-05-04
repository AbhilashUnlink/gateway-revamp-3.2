// Unit tests for `useVoid` (src/hooks/transactions/useVoid.ts).
//
// Notes:
//   - The underlying API method is named `postVoid` (not `void`) because
//     `void` is a reserved keyword. Tests assert the wired-up name.
//   - Same success/error/dispatch/onSuccess matrix as the other transaction
//     action hooks.
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useVoid } from '@/hooks/transactions/useVoid';
import { apiService } from '@/utils';

const toastSuccess = vi.fn();
const toastError = vi.fn();
const dispatch = vi.fn();
const onSuccess = vi.fn();

vi.mock('@/utils', () => ({
  apiService: { transactions: { postVoid: vi.fn() } },
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success: toastSuccess, error: toastError }),
}));

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => dispatch,
}));

vi.mock('@/store/slices/transactionsSlice', () => ({
  bumpRefreshCount: () => ({ type: 'transactions/bumpRefreshCount' }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const HEADERS = { 'X-Authorization': 'secret' };
const PAYLOAD = { id: 'tx-1', merchant_id: 'm-1' };

describe('useVoid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls apiService.transactions.postVoid with headers + payload', async () => {
    vi.mocked(apiService.transactions.postVoid).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useVoid(onSuccess));
    await act(async () => {
      await result.current.submitVoid(HEADERS, PAYLOAD);
    });

    expect(apiService.transactions.postVoid).toHaveBeenCalledWith(HEADERS, PAYLOAD);
  });

  it('on success: fires success toast, refresh dispatch, and onSuccess', async () => {
    vi.mocked(apiService.transactions.postVoid).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useVoid(onSuccess));
    await act(async () => {
      await result.current.submitVoid(HEADERS, PAYLOAD);
    });

    expect(toastSuccess).toHaveBeenCalledWith('drawer.void_success');
    expect(dispatch).toHaveBeenCalledWith({ type: 'transactions/bumpRefreshCount' });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('on axios failure: surfaces server message', async () => {
    vi.mocked(apiService.transactions.postVoid).mockRejectedValue({
      response: { data: { message: 'Cannot void after settlement' } },
    });

    const { result } = renderHook(() => useVoid());
    await act(async () => {
      await result.current.submitVoid(HEADERS, PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('Cannot void after settlement');
  });

  it('on generic error: falls back to i18n void error key', async () => {
    vi.mocked(apiService.transactions.postVoid).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useVoid());
    await act(async () => {
      await result.current.submitVoid(HEADERS, PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('drawer.void_error');
  });
});
