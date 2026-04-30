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

  if (type === 'CAPTURE') {
    const authorised = history.find((item) => (item.event ?? '').toUpperCase() === 'AUTHORISED');
    if (!authorised) return ZERO;

    const baseAmount = Number(authorised.amount ?? 0);

    let capturedAmount = 0;
    for (const item of history) {
      const event = (item.event ?? '').toUpperCase();
      const txnType = (item.TransactionType ?? '').toUpperCase();
      const amount = Number(item.amount ?? 0);

      if (
        event === 'CAPTURED' ||
        (event === 'INITIATED' && (txnType === 'CAPTURE' || txnType === 'PURCHASE'))
      ) {
        capturedAmount += amount;
      }
    }

    const remainingAmount = capturedAmount >= baseAmount ? 0 : baseAmount - capturedAmount;
    return { amount: baseAmount, remainingAmount };
  }

  let purchasedAmount = 0;
  let capturedSuccessAmount = 0;
  let refundedAmount = 0;

  for (const item of history) {
    const event = (item.event ?? '').toUpperCase();
    const txnType = (item.TransactionType ?? '').toUpperCase();
    const status = (item.status ?? '').toUpperCase();
    const amount = Number(item.amount ?? 0);

    if (event === 'PURCHASED') {
      purchasedAmount += amount;
    }
    if (event === 'CAPTURED' && status === 'SUCCESSFUL') {
      capturedSuccessAmount += amount;
    }
    if (
      event === 'REFUNDED' ||
      event === 'SENT_FOR_REFUND' ||
      (event === 'INITIATED' && txnType === 'REFUND')
    ) {
      refundedAmount += amount;
    }
  }

  const baseAmount = purchasedAmount > 0 ? purchasedAmount : capturedSuccessAmount;
  const remainingAmount = refundedAmount >= baseAmount ? 0 : baseAmount - refundedAmount;
  return { amount: baseAmount, remainingAmount };
}
