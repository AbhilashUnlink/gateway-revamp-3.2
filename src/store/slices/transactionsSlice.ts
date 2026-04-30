import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { TransactionRow } from '@/types/transactions/transaction.types';
import { fetchTransactionsList } from '@/store/thunks/transactionsThunks';
import type { RootState } from '..';

interface TransactionStats {
  totalCount: string;
  totalAmount: string;
  totalSales: string;
  totalRefund: string;
  approvalRatio: string;
  currency: string;
}

interface TransactionsState {
  rows: TransactionRow[];
  page: number;
  hasMore: boolean;
  loading: boolean;
  error: string | null;
  stats: TransactionStats;
}

const initialStats: TransactionStats = {
  totalCount: '0',
  totalAmount: '0',
  totalSales: '0',
  totalRefund: '0',
  approvalRatio: '0',
  currency: 'USD',
};

const initialState: TransactionsState = {
  rows: [],
  page: 1,
  hasMore: true,
  loading: false,
  error: null,
  stats: initialStats,
};

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    resetTransactions(state) {
      state.rows = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
      state.stats = initialStats;
    },
    appendRows(state, action: PayloadAction<TransactionRow[]>) {
      state.rows.push(...action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsList.fulfilled, (state, action) => {
        state.loading = false;
        state.rows.push(...action.payload.rows);
        state.hasMore = action.payload.hasMore;
        state.page = action.payload.page + 1;
        state.stats = action.payload.stats as TransactionStats;
      })
      .addCase(fetchTransactionsList.rejected, (state, action) => {
        state.loading = false;
        state.hasMore = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetTransactions, appendRows } = transactionsSlice.actions;
export const selectTotalCount = (state: RootState) => state.transactions.stats.totalCount ?? 0;
export default transactionsSlice.reducer;
