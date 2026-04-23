import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UIState {
  sidebarOpen: boolean;
  globalLoading: boolean;
  theme: 'light' | 'dark';
  activeModal: string | null;
  activeDrawer: string | null;
}

const initialState: UIState = {
  sidebarOpen: true,
  globalLoading: false,
  theme: 'light',
  activeModal: null,
  activeDrawer: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    setTheme(state, action: PayloadAction<'light' | 'dark'>) {
      state.theme = action.payload;
    },
    openModal(state, action: PayloadAction<string>) {
      state.activeModal = action.payload;
    },
    closeModal(state) {
      state.activeModal = null;
    },
    openDrawer(state, action: PayloadAction<string>) {
      state.activeDrawer = action.payload;
    },
    closeDrawer(state) {
      state.activeDrawer = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarOpen,
  setGlobalLoading,
  setTheme,
  openModal,
  closeModal,
  openDrawer,
  closeDrawer,
} = uiSlice.actions;
export default uiSlice.reducer;
