import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/utils/apiService';
import type {
  TransactionDetailsData,
  TransactionDetailsResponse,
} from '@/types/transactions/transactionDetails.types';

interface FetchResult {
  id: string;
  data: TransactionDetailsData;
  chargebackExists: boolean;
}

export const fetchTransactionDetails = createAsyncThunk<
  FetchResult,
  { id: string },
  { rejectValue: string }
>('transactionDetails/fetch', async ({ id }, thunkAPI) => {
  try {
    const [txRes, cbRes] = await Promise.all([
      apiService.transactions.getById({ id }),
      apiService.transactions.getChargebackByTransactionId({ transactionId: id }).catch(() => null),
    ]);

    const txData = (txRes as { data: TransactionDetailsResponse }).data.data;
    const cbData = cbRes as { data: { data?: unknown[] } } | null;
    const cbList = cbData?.data?.data;
    const chargebackExists = Array.isArray(cbList) && cbList.length > 0;

    return { id, data: txData, chargebackExists };
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message || 'Failed to load transaction details');
  }
});
