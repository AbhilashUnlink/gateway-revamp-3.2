import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type {
  TransactionDetailsData,
  TransactionHistoryItem,
} from '@/types/transactions/transactionDetails.types';
import type { ChargebackStageGroup } from '@/types/transactions/chargeback.types';
import { fetchTransactionDetails } from '@/store/thunks/transactionDetailsThunks';
import { hasAccess, TRANSACTION_PERMISSIONS } from '@/utils/transactionPermissions';

const TXN_TYPES = {
  AUTHORISATION: 'AUTHORISATION',
  CAPTURE: 'CAPTURE',
  PURCHASE: 'PURCHASE',
  REFUND: 'REFUND',
  VOID_AUTH: 'VOIDAUTHORISATION',
} as const;

const EVENTS = {
  VOIDED: 'VOIDED',
  CANCELLED: 'CANCELLED',
} as const;

const STATUS = {
  SUCCESSFUL: 'SUCCESSFUL',
  PENDING: 'PENDING',
  NOTSUCCESSFUL: 'NOTSUCCESSFUL',
} as const;

const RETRIEVAL_REQUEST_KEY = 'RetrievalRequest';

interface TransactionDetailsState {
  currentId: string | null;
  data: TransactionDetailsData | null;
  chargebackGroups: ChargebackStageGroup[];
  loading: boolean;
  error: string | null;
}

const initialState: TransactionDetailsState = {
  currentId: null,
  data: null,
  chargebackGroups: [],
  loading: false,
  error: null,
};

const transactionDetailsSlice = createSlice({
  name: 'transactionDetails',
  initialState,
  reducers: {
    resetTransactionDetails() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionDetails.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.currentId = action.meta.arg.id;
      })
      .addCase(fetchTransactionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentId = action.payload.id;
        state.data = action.payload.data;
        state.chargebackGroups = action.payload.chargebackGroups;
      })
      .addCase(fetchTransactionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to load transaction details';
      });
  },
});

export const { resetTransactionDetails } = transactionDetailsSlice.actions;
export default transactionDetailsSlice.reducer;

export const selectTransactionDetailsState = (state: RootState) => state.transactionDetails;
export const selectTransactionDetailsData = (state: RootState) => state.transactionDetails.data;
export const selectTransactionDetailsLoading = (state: RootState) =>
  state.transactionDetails.loading;
export const selectTransactionDetailsError = (state: RootState) => state.transactionDetails.error;
export const selectTransactionDetailsCurrentId = (state: RootState) =>
  state.transactionDetails.currentId;

export interface TransactionActionsVisibility {
  showRefund: boolean;
  showCapture: boolean;
  showVoid: boolean;
  showDispute: boolean;
  showEditStatus: boolean;
}

const HIDDEN: TransactionActionsVisibility = {
  showRefund: false,
  showCapture: false,
  showVoid: false,
  showDispute: false,
  showEditStatus: false,
};

const upper = (s: string | null | undefined) => (s ?? '').toUpperCase();

const sumByType = (
  history: TransactionHistoryItem[],
  type: string,
  predicate?: (item: TransactionHistoryItem) => boolean
): number =>
  history
    .filter((h) => upper(h.TransactionType) === type && (predicate ? predicate(h) : true))
    .reduce((sum, h) => sum + (h.amount ?? 0), 0);

interface DerivedAmounts {
  authorisedAmount: number;
  purchasedAmount: number;
  totalCapturedAmount: number;
  totalPendingCaptureAmount: number;
  totalRefundedAmount: number;
  hasVoidAuth: boolean;
  hasCancelledOrVoidedSuccess: boolean;
  hasPendingCapture: boolean;
  hasSuccessfulCapture: boolean;
  hasAuthorised: boolean;
}

function deriveAmounts(history: TransactionHistoryItem[]): DerivedAmounts {
  const isSuccess = (h: TransactionHistoryItem) => upper(h.status) === STATUS.SUCCESSFUL;
  const isPending = (h: TransactionHistoryItem) => upper(h.status) === STATUS.PENDING;

  return {
    authorisedAmount: sumByType(history, TXN_TYPES.AUTHORISATION, isSuccess),
    purchasedAmount: sumByType(history, TXN_TYPES.PURCHASE, isSuccess),
    totalCapturedAmount: sumByType(history, TXN_TYPES.CAPTURE, isSuccess),
    totalPendingCaptureAmount: sumByType(history, TXN_TYPES.CAPTURE, isPending),
    totalRefundedAmount: sumByType(history, TXN_TYPES.REFUND, isSuccess),
    hasVoidAuth: history.some(
      (h) => upper(h.TransactionType) === TXN_TYPES.VOID_AUTH || upper(h.event) === EVENTS.VOIDED
    ),
    hasCancelledOrVoidedSuccess: history.some(
      (h) =>
        isSuccess(h) && (upper(h.event) === EVENTS.VOIDED || upper(h.event) === EVENTS.CANCELLED)
    ),
    hasPendingCapture: history.some(
      (h) => upper(h.TransactionType) === TXN_TYPES.CAPTURE && isPending(h)
    ),
    hasSuccessfulCapture: history.some(
      (h) => upper(h.TransactionType) === TXN_TYPES.CAPTURE && isSuccess(h)
    ),
    hasAuthorised: history.some(
      (h) => upper(h.TransactionType) === TXN_TYPES.AUTHORISATION && isSuccess(h)
    ),
  };
}

function hasValidChargeback(groups: ChargebackStageGroup[]): boolean {
  const otherThanRetrieval = groups.filter(
    (item) => Object.keys(item)[0] !== RETRIEVAL_REQUEST_KEY
  );
  return otherThanRetrieval
    .map((item) => Object.values(item).filter(Boolean).flat().length)
    .some((len) => len > 0);
}

function hasUpdateStatusLog(transactionLog: unknown[]): boolean {
  return (transactionLog ?? []).some((entry) => {
    if (!entry || typeof entry !== 'object') return false;
    const action = (entry as { Action?: unknown }).Action;
    return action === 'UPDATE_STATUS' || action === null;
  });
}

const selectChargebackGroups = (state: RootState) => state.transactionDetails.chargebackGroups;
const selectUserGroups = (state: RootState) => state.auth.signInData.Groups;

export const selectTransactionActions = createSelector(
  [selectTransactionDetailsData, selectChargebackGroups, selectUserGroups],
  (data, chargebackGroups, userGroups): TransactionActionsVisibility => {
    if (!data) return HIDDEN;

    const status = upper(data.Status);
    const transactionType = upper(data.TransactionType);
    const history = data.TransactionHistory ?? [];
    const amounts = deriveAmounts(history);

    const validChargeback = hasValidChargeback(chargebackGroups);

    // Refund: capture-or-purchase amount must exceed refunded, no valid chargeback, not blocked, has access
    const isRefundButtonEnabled =
      (amounts.totalCapturedAmount > amounts.totalRefundedAmount ||
        amounts.purchasedAmount > amounts.totalRefundedAmount) &&
      !validChargeback &&
      !data.IsBlockRefund &&
      hasAccess(TRANSACTION_PERMISSIONS.REFUND_TRANSACTION, userGroups);

    // Capture: authorised must exceed already-captured + pending-capture, and auth must not be voided/cancelled
    const isCaptureButtonEnabled =
      amounts.authorisedAmount > amounts.totalCapturedAmount + amounts.totalPendingCaptureAmount &&
      !amounts.hasVoidAuth &&
      !amounts.hasCancelledOrVoidedSuccess &&
      hasAccess(TRANSACTION_PERMISSIONS.CAPTURE_TRANSACTION, userGroups);

    // Void: AUTHORISED exists AND no successful capture, no pending capture, no VOID AUTH, no cancelled/voided success
    const isVoidButtonEnabled =
      amounts.hasAuthorised &&
      !amounts.hasSuccessfulCapture &&
      !amounts.hasPendingCapture &&
      !amounts.hasVoidAuth &&
      !amounts.hasCancelledOrVoidedSuccess &&
      hasAccess(TRANSACTION_PERMISSIONS.VOID_TRANSACTION, userGroups);

    // Dispute: refund-enabled (and not AUTHORISATION/REFUND) OR successful PURCHASE/CAPTURE; AND has access
    const disputeEligible =
      (isRefundButtonEnabled &&
        transactionType !== TXN_TYPES.AUTHORISATION &&
        transactionType !== TXN_TYPES.REFUND) ||
      (status === STATUS.SUCCESSFUL && transactionType === TXN_TYPES.PURCHASE) ||
      (status === STATUS.SUCCESSFUL && transactionType === TXN_TYPES.CAPTURE);

    const isDisputeButtonEnabled =
      disputeEligible && hasAccess(TRANSACTION_PERMISSIONS.DISPUTE_TRANSACTION_ACCESS, userGroups);

    // Edit Status: NOTSUCCESSFUL/PENDING OR transactionLog has UPDATE_STATUS / null Action; AND has access
    const editStatusEligible =
      status === STATUS.NOTSUCCESSFUL ||
      status === STATUS.PENDING ||
      hasUpdateStatusLog(data.TransactionLog ?? []);

    const isEditStatusButtonEnabled =
      editStatusEligible && hasAccess(TRANSACTION_PERMISSIONS.EDIT_STATUS_BUTTON, userGroups);

    return {
      showRefund: isRefundButtonEnabled,
      showCapture: isCaptureButtonEnabled,
      showVoid: isVoidButtonEnabled,
      showDispute: isDisputeButtonEnabled,
      showEditStatus: isEditStatusButtonEnabled,
    };
  }
);
