// Unit tests for `useDispute` (src/hooks/transactions/useDispute.ts).
//
// `useDispute` lives slightly outside the transaction hook family — it talks
// to apiService.chargeback.add (not apiService.transactions.*) and does not
// dispatch a refresh bump. Tests cover happy path + both error code paths.
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDispute } from '@/hooks/transactions/useDispute';
import { apiService } from '@/utils';

const toastSuccess = vi.fn();
const toastError = vi.fn();
const onSuccess = vi.fn();

vi.mock('@/utils', () => ({
  apiService: { chargeback: { add: vi.fn() } },
}));

vi.mock('@/hooks/useToast', () => ({
  useToast: () => ({ success: toastSuccess, error: toastError }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// Minimal-but-typed payload satisfying the DisputePayload shape; values are
// arbitrary because we only assert pass-through.
const PAYLOAD = {
  TransactionID: 'tx-1',
  uuid: 'u-1',
  Scheme: 'VISA',
  CardNumber: '4111',
  Date: '2026-01-01',
  amount: 100,
  AcquirerCode: 'AC',
  AuthCode: null,
  CurrencyCode: 'USD',
  TransactionType: 'SALE',
  IssuedDate: '2026-01-01',
  CaseType: 'CHARGEBACK',
  ARN: 'ARN1',
  ReasonCode: '13.1',
  DueDate: '2026-02-01',
  DASMID: 'm-1',
  TimeZone: 'UTC',
  Currency: 'USD',
};

describe('useDispute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls chargeback.add with the supplied payload', async () => {
    vi.mocked(apiService.chargeback.add).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useDispute(onSuccess));
    await act(async () => {
      await result.current.submitDispute(PAYLOAD);
    });

    expect(apiService.chargeback.add).toHaveBeenCalledWith(PAYLOAD);
  });

  it('on success: success toast + onSuccess fires', async () => {
    vi.mocked(apiService.chargeback.add).mockResolvedValue(undefined as never);

    const { result } = renderHook(() => useDispute(onSuccess));
    await act(async () => {
      await result.current.submitDispute(PAYLOAD);
    });

    expect(toastSuccess).toHaveBeenCalledWith('drawer.dispute_success');
    expect(onSuccess).toHaveBeenCalledTimes(1);
  });

  it('on axios failure: surfaces server message', async () => {
    vi.mocked(apiService.chargeback.add).mockRejectedValue({
      response: { data: { message: 'Dispute window expired' } },
    });

    const { result } = renderHook(() => useDispute());
    await act(async () => {
      await result.current.submitDispute(PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('Dispute window expired');
  });

  it('on generic error: falls back to i18n key', async () => {
    vi.mocked(apiService.chargeback.add).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useDispute());
    await act(async () => {
      await result.current.submitDispute(PAYLOAD);
    });

    expect(toastError).toHaveBeenCalledWith('drawer.dispute_error');
  });
});
