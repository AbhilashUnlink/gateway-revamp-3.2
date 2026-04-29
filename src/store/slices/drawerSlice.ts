import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DrawerEntry {
  type: string;
  data?: Record<string, unknown>;
}

interface DrawersState {
  current: DrawerEntry | null;
}

const initialState: DrawersState = {
  current: null,
};

const drawerSlice = createSlice({
  name: 'drawers',
  initialState,
  reducers: {
    openDrawer(state, action: PayloadAction<DrawerEntry>) {
      state.current = action.payload;
    },
    closeDrawer(state) {
      state.current = null;
    },
  },
});

export const { openDrawer, closeDrawer } = drawerSlice.actions;
export default drawerSlice.reducer;
