import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/utils/apiService';

export const approveStatement = createAsyncThunk(
  'statements/approve',
  async (payload: unknown, thunkAPI) => {
    try {
      const res = await apiService.statements.postStatementApprove(payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

export const regenerateStatement = createAsyncThunk(
  'statements/regenerate',
  async (payload: unknown, thunkAPI) => {
    try {
      const res = await apiService.statements.postStatementRegenerate(payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

export const generateSignedUrl = createAsyncThunk(
  'statements/generateSignedUrl',
  async (payload: unknown, thunkAPI) => {
    try {
      const res = await apiService.statements.postS3GenerateSignedUrl(payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);
