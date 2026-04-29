import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from '../thunks/authThunks';
import type { AuthToken, SignInData } from '@/types/login/auth.types';

export interface TokensRefreshedPayload {
  token: Partial<AuthToken>;
  exp?: number;
}

interface AuthState {
  signInData: SignInData;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialSignInData = {
  token: {
    accessToken: '',
    idToken: '',
    refreshToken: '',
  },
  email: '',
  exp: 0,
  uid: '',
  auth_time: 0,
  Groups: [],
  subsidiaries: [],
  name: '',
  appLevel: '',
  contactNo: '',
  referralCode: '',
  accessLevel: '',
  signInAsMerchant: false,
  passwordExpiry: '',
};

const initialState: AuthState = {
  signInData: initialSignInData,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    tokensRefreshed: (state, action: PayloadAction<TokensRefreshedPayload>) => {
      state.signInData.token = {
        ...state.signInData.token,
        ...action.payload.token,
      };
      if (typeof action.payload.exp === 'number') {
        state.signInData.exp = action.payload.exp;
      }
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
        state.signInData = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.signInData = initialSignInData;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { tokensRefreshed } = authSlice.actions;
export default authSlice.reducer;
