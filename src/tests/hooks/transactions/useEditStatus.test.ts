// Unit tests for `useEditStatus` (src/hooks/transactions/useEditStatus.ts).
//
// Differences from the other transaction action hooks:
//   - Calls apiService.transactions.postUpdateStatus (single payload arg, no
//     extra header arg).
//   - Does NOT dispatch a Redux refresh bump — this hook is intentionally
//     side-effect light because the parent screen drives refreshing.
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useEditStatus } from '@/hooks/transactions/useEditStatus';
import { apiService } from '@/utils';

const toastSuccess = vi.fn();
const toastError = vi.fn();
const onSuccess = vi.fn();

vi.mock('@/utils', () => ({
  apiService: { transactions: { postUpdateStatus: vi.fn() } },
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success: toastSuccess, error: toastError }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const PAYLOAD = {
  transaction_id: 'tx-1',
  message: 'manual override',
  status: 'CAPTURED',
  authCode: 'A1',
};

describe('useEditStatus', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls postUpdateStatus with the supplied payload', async () => {
    vi.mocked(apiService.transactions.postUpdateStatus).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useEditStatus(onSuccess));
    await act(async () => {
      await result.current.submitEditStatus(PAYLOAD);
    });

    expect(apiService.transactions.postUpdateStatus).toHaveBeenCalledWith(PAYLOAD);
  });

  it('on success: success toast + onSuccess callback (no Redux dispatch)', async () => {
    vi.mocked(apiService.transactions.postUpdateStatus).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useEditStatus(onSuccess));
    await act(async () => {
      await result.current.submitEditStatus(PAYLOAD);
    });

    expect(toastSuccess).toHaveBeenCalledWith('drawer.edit_status_success');
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('on axios failure: surfaces server message', async () => {
    vi.mocked(apiService.transactions.postUpdateStatus).mockRejectedValue({
      response: { data: { message: 'Status not allowed' } },
    });

    const { result } = renderHook(() => useEditStatus());
    await act(async () => {
      await result.current.submitEditStatus(PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('Status not allowed');
  });

  it('on generic error: falls back to i18n key', async () => {
    vi.mocked(apiService.transactions.postUpdateStatus).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useEditStatus());
    await act(async () => {
      await result.current.submitEditStatus(PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('drawer.edit_status_error');
  });
});
