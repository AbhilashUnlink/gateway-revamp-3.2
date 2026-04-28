import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface DrawerEntry {
  type: string;
  data?: Record<string, unknown>;
}

interface DrawersState {
  drawers: DrawerEntry[];
}

const initialState: DrawersState = {
  drawers: [],
};

const drawerSlice = createSlice({
  name: 'drawers',
  initialState,
  reducers: {
    openDrawer(state, action: PayloadAction<DrawerEntry>) {
      state.drawers = [action.payload];
    },
    closeDrawer(state, action: PayloadAction<string>) {
      state.drawers = state.drawers.filter((d) => d.type !== action.payload);
    },
    closeAllDrawers(state) {
      state.drawers = [];
    },
  },
});

export const { openDrawer, closeDrawer, closeAllDrawers } = drawerSlice.actions;
export default drawerSlice.reducer;
