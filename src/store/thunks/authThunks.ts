import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/utils/apiService';
import { clearPermissions } from '../slices/permissionSlice';
import { clearProfile } from '../slices/userSlice';
import type { RootState } from '@/store';
import type {
  SignInData,
  SignInPayload,
  SignInResponse,
  SignoutPayload,
} from '@/types/login/auth.types';

export const loginUser = createAsyncThunk<SignInData, SignInPayload>(
  'auth/loginUser',
  async (payload, thunkAPI) => {
    try {
      const res = await apiService.auth.signIn(payload);
      return (res.data as SignInResponse).data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message ?? 'Login failed');
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, thunkAPI) => {
  const { signInData } = (thunkAPI.getState() as RootState).auth;

  const payload: SignoutPayload = {
    username: signInData.email,
    token: signInData.token,
  };

  try {
    await apiService.auth.signOut(payload);
  } catch {
    // proceed with local cleanup even if API call fails
  }
  thunkAPI.dispatch(clearPermissions());
  thunkAPI.dispatch(clearProfile());
});

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (payload: unknown, thunkAPI) => {
    try {
      const res = await apiService.auth.refreshToken(payload);
      return res.data as { accessToken?: string; refreshToken?: string };
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message ?? 'Token refresh failed');
    }
  }
);
