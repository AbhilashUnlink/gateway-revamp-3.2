import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';

export type TransactionAmountType = 'REFUND' | 'CAPTURE';

export interface TransactionAmounts {
  amount: number;
  remainingAmount: number;
}

const ZERO: TransactionAmounts = { amount: 0, remainingAmount: 0 };

export function calculateTransactionAmounts(
  transactionDetail: TransactionDetailsData | null | undefined,
  type: TransactionAmountType
): TransactionAmounts {
  const history = transactionDetail?.TransactionHistory;
  if (!history?.length) return ZERO;

  let purchasedAmount = 0;
  let capturedSuccessAmount = 0;
  let refundedAmount = 0;

  for (const item of history) {
    const event = (item.event ?? '').toUpperCase();
    const txnType = (item.TransactionType ?? '').toUpperCase();
    const status = (item.status ?? '').toUpperCase();
    const amount = item.amount ?? 0;

    if (event === 'PURCHASED') {
      purchasedAmount += amount;
    } else if (event === 'CAPTURED' && status === 'SUCCESSFUL') {
      capturedSuccessAmount += amount;
    } else if (
      event === 'REFUNDED' ||
      event === 'SENT_FOR_REFUND' ||
      (event === 'INITIATED' && txnType === 'REFUND')
    ) {
      refundedAmount += amount;
    }
  }

  const baseAmount = purchasedAmount > 0 ? purchasedAmount : capturedSuccessAmount;
  const consumed = type === 'REFUND' ? refundedAmount : capturedSuccessAmount;
  const remainingAmount = Math.max(0, baseAmount - consumed);

  return { amount: baseAmount, remainingAmount };
}
