import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store';

export interface ScreenColumnPreference {
  /** Column ids in the order they should appear. Empty = use default order. */
  order: string[];
  /** Column ids hidden from the table. */
  hidden: string[];
}

interface ColumnPreferencesState {
  byScreen: Record<string, ScreenColumnPreference>;
}

const initialState: ColumnPreferencesState = {
  byScreen: {},
};

const columnPreferencesSlice = createSlice({
  name: 'columnPreferences',
  initialState,
  reducers: {
    setColumnPreference(
      state,
      action: PayloadAction<{ screen: string; preference: ScreenColumnPreference }>
    ) {
      state.byScreen[action.payload.screen] = action.payload.preference;
    },
    resetColumnPreference(state, action: PayloadAction<string>) {
      delete state.byScreen[action.payload];
    },
  },
});

export const { setColumnPreference, resetColumnPreference } = columnPreferencesSlice.actions;
export default columnPreferencesSlice.reducer;

const EMPTY: ScreenColumnPreference = { order: [], hidden: [] };

export const selectColumnPreference = (screen: string) => (state: RootState) =>
  state.columnPreferences.byScreen[screen] ?? EMPTY;
