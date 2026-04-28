import { createSlice, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { TransactionDetailsData } from '@/types/transactions/transactionDetails.types';
import { fetchTransactionDetails } from '@/store/thunks/transactionDetailsThunks';

const CAPTURABLE_EVENTS = ['AUTHORIZED'];
const REFUNDABLE_EVENTS = ['CAPTURED', 'PURCHASE', 'PURCHASED'];
const VOIDABLE_EVENTS = ['AUTHORIZED', 'CAPTURED'];
const EDIT_STATUS_ELIGIBLE_STATUSES = [
  'PENDING',
  'INPROGRESS',
  'IN_PROGRESS',
  'REVIEW',
  'ERROR',
  'INCOMPLETE',
  'NOTSUCCESSFUL',
  'UNKNOWN',
  '',
];

interface TransactionDetailsState {
  currentId: string | null;
  data: TransactionDetailsData | null;
  chargebackExists: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: TransactionDetailsState = {
  currentId: null,
  data: null,
  chargebackExists: false,
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
        state.chargebackExists = action.payload.chargebackExists;
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

export const selectTransactionActions = createSelector(
  [selectTransactionDetailsData, (state: RootState) => state.transactionDetails.chargebackExists],
  (data, chargebackExists): TransactionActionsVisibility => {
    if (!data) return HIDDEN;
    const event = (data.Event ?? '').toUpperCase();
    const status = (data.Status ?? '').toUpperCase();
    return {
      showRefund: REFUNDABLE_EVENTS.includes(event) && !data.IsBlockRefund,
      showCapture: CAPTURABLE_EVENTS.includes(event),
      showVoid: VOIDABLE_EVENTS.includes(event),
      showDispute: !chargebackExists,
      showEditStatus: EDIT_STATUS_ELIGIBLE_STATUSES.includes(status),
    };
  }
);
