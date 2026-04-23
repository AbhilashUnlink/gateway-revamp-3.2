import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface PermissionState {
  userGroups: string[];
}

const initialState: PermissionState = {
  userGroups: [],
};

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    setUserGroups(state, action: PayloadAction<string[]>) {
      state.userGroups = action.payload;
    },
    clearPermissions(state) {
      state.userGroups = [];
    },
  },
});

export const { setUserGroups, clearPermissions } = permissionSlice.actions;

export const hasAccess =
  (routeAllowedGroups?: string[]) =>
  (state: RootState): boolean => {
    if (!routeAllowedGroups || routeAllowedGroups.length === 0) return true;
    return routeAllowedGroups.some((g) => state.permissions.userGroups.includes(g));
  };

export default permissionSlice.reducer;
