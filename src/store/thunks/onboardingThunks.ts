import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/utils/apiService';

export const fetchApplication = createAsyncThunk(
  'onboarding/fetchApplication',
  async (_, thunkAPI) => {
    try {
      const res = await apiService.onboarding.getApplication();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

export const submitApplication = createAsyncThunk(
  'onboarding/submitApplication',
  async (_, thunkAPI) => {
    try {
      const res = await apiService.onboarding.postApplicationSubmit();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'onboarding/verifyOtp',
  async (payload: unknown, thunkAPI) => {
    try {
      const res = await apiService.onboarding.postVerifyOtp(payload);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);
