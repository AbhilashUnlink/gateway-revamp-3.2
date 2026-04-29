import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/utils/apiService';
import type {
  TransactionDetailsData,
  TransactionDetailsResponse,
} from '@/types/transactions/transactionDetails.types';
import type { ChargebackStageGroup } from '@/types/transactions/chargeback.types';

interface FetchResult {
  id: string;
  data: TransactionDetailsData;
  chargebackGroups: ChargebackStageGroup[];
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
    const cbData = cbRes as { data: { data?: ChargebackStageGroup[] } } | null;
    const chargebackGroups = Array.isArray(cbData?.data?.data) ? cbData!.data!.data! : [];

    return { id, data: txData, chargebackGroups };
  } catch (err) {
    return thunkAPI.rejectWithValue((err as Error).message || 'Failed to load transaction details');
  }
});
