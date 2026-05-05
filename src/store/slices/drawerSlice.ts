import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DrawerEntry {
  type: string;
  data?: Record<string, unknown>;
}

interface DrawersState {
  current: DrawerEntry | null;
  wasAlreadyOpen: boolean;
}

const initialState: DrawersState = {
  current: null,
  wasAlreadyOpen: false,
};

const drawerSlice = createSlice({
  name: 'drawers',
  initialState,
  reducers: {
    openDrawer(state, action: PayloadAction<DrawerEntry>) {
      state.wasAlreadyOpen = state.current !== null;
      state.current = action.payload;
    },
    closeDrawer(state) {
      state.current = null;
      state.wasAlreadyOpen = false;
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
