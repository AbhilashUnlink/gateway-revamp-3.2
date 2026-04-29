import type { TransactionActionsVisibility } from '@/store/slices/transactionDetailsSlice';

export const ALWAYS_ALLOWED_DRAWERS = new Set(['details']);

export function isDrawerAllowed(type: string, actions: TransactionActionsVisibility): boolean {
  switch (type) {
    case 'refund':
      return actions.showRefund;
    case 'capture':
      return actions.showCapture;
    case 'void':
      return actions.showVoid;
    case 'dispute':
      return actions.showDispute;
    case 'edit-status':
      return actions.showEditStatus;
    default:
      return ALWAYS_ALLOWED_DRAWERS.has(type);
  }
}
