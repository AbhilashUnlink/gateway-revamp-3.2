import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/utils/apiService';

export const fetchTransaction = createAsyncThunk(
  'transactions/fetchById',
  async (params: { id: string }, thunkAPI) => {
    try {
      const res = await apiService.transactions.getEndpoint(params);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

export const downloadTransactionReport = createAsyncThunk(
  'transactions/downloadReport',
  async (payload: unknown, thunkAPI) => {
    try {
      const res = await apiService.transactions.postTransactionReportDownload(payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

export const voidTransaction = createAsyncThunk(
  'transactions/void',
  async (payload: unknown, thunkAPI) => {
    try {
      const res = await apiService.transactions.postVoid(payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

export const captureTransaction = createAsyncThunk(
  'transactions/capture',
  async (payload: unknown, thunkAPI) => {
    try {
      const res = await apiService.transactions.postCapture(payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);
