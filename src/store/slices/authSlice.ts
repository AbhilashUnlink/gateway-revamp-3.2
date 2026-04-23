import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from '../thunks/authThunks';
import type { SignInData } from '@/types/login/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: SignInData | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens(state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    setAuthData(state, action: PayloadAction<SignInData>) {
      state.user = action.payload;
      state.accessToken = action.payload.token.accessToken;
      state.refreshToken = action.payload.token.refreshToken;
      state.isAuthenticated = true;
      state.error = null;
    },
    resetTokens(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.accessToken = action.payload.token?.accessToken ?? null;
        state.refreshToken = action.payload.token?.refreshToken ?? null;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.accessToken = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      });
  },
});

export const { setTokens, setAuthData, resetTokens } = authSlice.actions;
export default authSlice.reducer;
