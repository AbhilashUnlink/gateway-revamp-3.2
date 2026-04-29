import { createSlice, type PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { RootState } from '@/store';
import type { FilterRule } from '@/components/filter/types';

export type FilterScreen = 'transactions' | 'merchants';

interface ScreenFilterState {
  /** Draft rules currently being edited in the popover. */
  draftRules: FilterRule[];
  /** Applied rules — used for actual API calls. */
  appliedRules: FilterRule[];
  isOpen: boolean;
}

interface FiltersState {
  byScreen: Record<FilterScreen, ScreenFilterState>;
}

const emptyScreen = (): ScreenFilterState => ({
  draftRules: [],
  appliedRules: [],
  isOpen: false,
});

const initialState: FiltersState = {
  byScreen: {
    transactions: emptyScreen(),
    merchants: emptyScreen(),
  },
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    openFilter(state, action: PayloadAction<FilterScreen>) {
      const s = state.byScreen[action.payload];
      // Editing starts from currently applied rules.
      s.draftRules = s.appliedRules.length ? s.appliedRules.map((r) => ({ ...r })) : [];
      s.isOpen = true;
    },
    closeFilter(state, action: PayloadAction<FilterScreen>) {
      state.byScreen[action.payload].isOpen = false;
    },
    addRule(state, action: PayloadAction<{ screen: FilterScreen; rule: FilterRule }>) {
      state.byScreen[action.payload.screen].draftRules.push(action.payload.rule);
    },
    updateRule(
      state,
      action: PayloadAction<{ screen: FilterScreen; id: string; patch: Partial<FilterRule> }>
    ) {
      const s = state.byScreen[action.payload.screen];
      const idx = s.draftRules.findIndex((r) => r.id === action.payload.id);
      if (idx >= 0) s.draftRules[idx] = { ...s.draftRules[idx], ...action.payload.patch };
    },
    removeRule(state, action: PayloadAction<{ screen: FilterScreen; id: string }>) {
      const s = state.byScreen[action.payload.screen];
      s.draftRules = s.draftRules.filter((r) => r.id !== action.payload.id);
    },
    applyFilters(state, action: PayloadAction<FilterScreen>) {
      const s = state.byScreen[action.payload];
      s.appliedRules = s.draftRules.filter(
        (r) =>
          r.field &&
          r.value !== undefined &&
          r.value !== '' &&
          !(Array.isArray(r.value) && r.value.length === 0)
      );
      s.isOpen = false;
    },
    resetFilters(state, action: PayloadAction<FilterScreen>) {
      const s = state.byScreen[action.payload];
      s.draftRules = [];
      s.appliedRules = [];
    },
    /** Replace draft + applied rules wholesale (used when loading a saved preset). */
    loadRules(state, action: PayloadAction<{ screen: FilterScreen; rules: FilterRule[] }>) {
      const s = state.byScreen[action.payload.screen];
      s.draftRules = action.payload.rules;
      s.appliedRules = action.payload.rules;
      s.isOpen = false;
    },
  },
});

export const {
  openFilter,
  closeFilter,
  addRule,
  updateRule,
  removeRule,
  applyFilters,
  resetFilters,
  loadRules,
} = filterSlice.actions;

export default filterSlice.reducer;

// ── Selectors ────────────────────────────────────────────────────────────

const selectScreen = (state: RootState, screen: FilterScreen) => state.filters.byScreen[screen];

export const selectFilterIsOpen = (screen: FilterScreen) => (state: RootState) =>
  selectScreen(state, screen).isOpen;

export const selectDraftRules = (screen: FilterScreen) => (state: RootState) =>
  selectScreen(state, screen).draftRules;

export const selectAppliedRules = (screen: FilterScreen) => (state: RootState) =>
  selectScreen(state, screen).appliedRules;

export const makeSelectAppliedCount = (screen: FilterScreen) =>
  createSelector([selectAppliedRules(screen)], (rules) => rules.length);
