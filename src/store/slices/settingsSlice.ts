import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
}

const initialState: SettingsState = {
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  currency: 'USD',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSettings(state, action: PayloadAction<Partial<SettingsState>>) {
      return { ...state, ...action.payload };
    },
    resetSettings() {
      return initialState;
    },
  },
});

export const { updateSettings, resetSettings } = settingsSlice.actions;
export default settingsSlice.reducer;
