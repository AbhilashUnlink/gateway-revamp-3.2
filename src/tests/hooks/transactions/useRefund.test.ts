// Unit tests for `useRefund` (src/hooks/transactions/useRefund.ts).
//
// Mirrors the shape of `useCapture` — calls apiService.transactions.refund,
// shows a toast, dispatches a refresh bump and invokes onSuccess on success.
// The test cases below cover the same matrix so behaviour stays consistent
// across the refund/capture/void hook family.
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRefund } from '@/hooks/transactions/useRefund';
import { apiService } from '@/utils';

const toastSuccess = vi.fn();
const toastError = vi.fn();
const dispatch = vi.fn();
const onSuccess = vi.fn();

vi.mock('@/utils', () => ({
  apiService: { transactions: { refund: vi.fn() } },
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
const PAYLOAD = { id: 'tx-1', refundAmount: 25, notes: 'test', merchant_id: 'm-1' };

describe('useRefund', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('forwards headers and payload to apiService.transactions.refund', async () => {
    vi.mocked(apiService.transactions.refund).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useRefund(onSuccess));
    await act(async () => {
      await result.current.submitRefund(HEADERS, PAYLOAD);
    });

    expect(apiService.transactions.refund).toHaveBeenCalledWith(HEADERS, PAYLOAD);
  });

  it('on success: success toast + dispatch refresh + onSuccess fires', async () => {
    vi.mocked(apiService.transactions.refund).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useRefund(onSuccess));
    await act(async () => {
      await result.current.submitRefund(HEADERS, PAYLOAD);
    });

    expect(toastSuccess).toHaveBeenCalledWith('drawer.refund_success');
    expect(dispatch).toHaveBeenCalledWith({ type: 'transactions/bumpRefreshCount' });
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('on axios failure: surfaces the server message via error toast', async () => {
    vi.mocked(apiService.transactions.refund).mockRejectedValue({
      response: { data: { message: 'Refund window expired' } },
    });

    const { result } = renderHook(() => useRefund());
    await act(async () => {
      await result.current.submitRefund(HEADERS, PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('Refund window expired');
  });

  it('on generic error: falls back to the i18n refund error key', async () => {
    vi.mocked(apiService.transactions.refund).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useRefund());
    await act(async () => {
      await result.current.submitRefund(HEADERS, PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('drawer.refund_error');
  });
});
