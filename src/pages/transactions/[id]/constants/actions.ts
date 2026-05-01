import type { TransactionActionsVisibility } from '@/store/slices/transactionDetailsSlice';
import type { TransactionActionType } from '../types';

export interface ActionConfig {
  type: Exclude<TransactionActionType, 'edit-status'>;
  labelKey: string;
  visibilityKey: keyof Pick<
    TransactionActionsVisibility,
    'showRefund' | 'showVoid' | 'showCapture' | 'showDispute'
  >;
}

export const ACTION_BUTTONS: ActionConfig[] = [
  { type: 'refund', labelKey: 'drawer.refund', visibilityKey: 'showRefund' },
  { type: 'void', labelKey: 'drawer.void', visibilityKey: 'showVoid' },
  { type: 'capture', labelKey: 'drawer.capture', visibilityKey: 'showCapture' },
  { type: 'dispute', labelKey: 'drawer.dispute', visibilityKey: 'showDispute' },
];
