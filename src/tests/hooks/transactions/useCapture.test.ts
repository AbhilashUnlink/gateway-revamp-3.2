// Unit tests for `useCapture` (src/hooks/transactions/useCapture.ts).
//
// Surface under test:
//   - `submitCapture(headers, payload)` — POSTs the capture, on success
//     fires a success toast + bumps the transactions refresh count + invokes
//     the optional `onSuccess` callback. On failure, fires an error toast
//     using either the axios message or a default i18n string.
//   - `loading` — true while the request is in flight, false once settled.
//
// Mocking strategy:
//   - apiService.transactions.capture is mocked per test (success / failure).
//   - useToast is mocked to expose success/error spies we can assert on.
//   - useAppDispatch returns a spy; bumpRefreshCount is also mocked so we can
//     assert dispatch was called with its action creator's return value.
//   - react-i18next's t() returns the key as-is so we can assert on keys.
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCapture } from '@/hooks/transactions/useCapture';
import { apiService } from '@/utils';

// Spies replaced fresh in beforeEach so each test starts from a clean state.
const toastSuccess = vi.fn();
const toastError = vi.fn();
const dispatch = vi.fn();
const onSuccess = vi.fn();

vi.mock('@/utils', () => ({
  apiService: {
    transactions: {
      capture: vi.fn(),
    },
  },
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success: toastSuccess, error: toastError }),
}));

vi.mock('@/store/hooks', () => ({
  useAppDispatch: () => dispatch,
}));

vi.mock('@/store/slices/transactionsSlice', () => ({
  // Return a recognisable action object so we can assert dispatch arguments.
  bumpRefreshCount: () => ({ type: 'transactions/bumpRefreshCount' }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const HEADERS = { 'X-Authorization': 'secret' };
const PAYLOAD = { id: 'tx-1', captureAmount: 50, notes: 'test', merchant_id: 'm-1' };

describe('useCapture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls the capture API with the supplied headers and payload', async () => {
    vi.mocked(apiService.transactions.capture).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useCapture(onSuccess));
    await act(async () => {
      await result.current.submitCapture(HEADERS, PAYLOAD);
    });

    expect(apiService.transactions.capture).toHaveBeenCalledWith(HEADERS, PAYLOAD);
  });

  it('on success: shows success toast, dispatches refresh bump, calls onSuccess', async () => {
    vi.mocked(apiService.transactions.capture).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useCapture(onSuccess));
    await act(async () => {
      await result.current.submitCapture(HEADERS, PAYLOAD);
    });

    expect(toastSuccess).toHaveBeenCalledWith('drawer.capture_success');
    expect(dispatch).toHaveBeenCalledWith({ type: 'transactions/bumpRefreshCount' });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(toastError).not.toHaveBeenCalled();
  });

  it('on axios-style failure with response message: shows that message in error toast', async () => {
    vi.mocked(apiService.transactions.capture).mockRejectedValue({
      response: { data: { message: 'Insufficient balance' } },
    });

    const { result } = renderHook(() => useCapture(onSuccess));
    await act(async () => {
      await result.current.submitCapture(HEADERS, PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('Insufficient balance');
    // Side effects associated with success must not run on failure.
    expect(toastSuccess).not.toHaveBeenCalled();
    expect(dispatch).not.toHaveBeenCalled();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('on failure without a response message: falls back to the i18n error key', async () => {
    vi.mocked(apiService.transactions.capture).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useCapture());
    await act(async () => {
      await result.current.submitCapture(HEADERS, PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('drawer.capture_error');
  });

  it('toggles `loading` true while pending and false once the call settles', async () => {
    let resolveCall: (() => void) | undefined;
    vi.mocked(apiService.transactions.capture).mockImplementation(
      () =>
        new Promise<void>((resolve) => {
          resolveCall = resolve;
        }) as never
    );

    const { result } = renderHook(() => useCapture());

    // Kick off the call but don't await it yet, so we can observe loading=true.
    let pending: Promise<void> | undefined;
    act(() => {
      pending = result.current.submitCapture(HEADERS, PAYLOAD);
    });
    expect(result.current.loading).toBe(true);

    // Now resolve and wait for the hook state update.
    await act(async () => {
      resolveCall?.();
      await pending;
    });
    expect(result.current.loading).toBe(false);
  });
});
