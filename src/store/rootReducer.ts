import { combineReducers, type Action } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import permissionReducer from './slices/permissionSlice';
import settingsReducer from './slices/settingsSlice';
import transactionsReducer from './slices/transactionsSlice';
import transactionDetailsReducer from './slices/transactionDetailsSlice';
import drawersReducer from './slices/drawerSlice';
import gatewayConfigReducer from './slices/gatewayConfigSlice';
import filtersReducer from './slices/filterSlice';
import presetFiltersReducer from './slices/presetFiltersSlice';
import downloadsReducer from './slices/downloadsSlice';
import columnPreferencesReducer from './slices/columnPreferencesSlice';
import { storage } from './persistConfig';
import { SESSION_EXPIRED_ACTION } from '@/utils/forceLogout';

// Only the per-screen view state survives reloads — server `lists` and
// loading flags are intentionally excluded so they're refetched fresh.
const columnPreferencesPersistConfig = {
  key: 'columnPreferences',
  storage,
  whitelist: ['byScreen'],
};

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  ui: uiReducer,
  permissions: permissionReducer,
  settings: settingsReducer,
  transactions: transactionsReducer,
  transactionDetails: transactionDetailsReducer,
  drawers: drawersReducer,
  gatewayConfig: gatewayConfigReducer,
  filters: filtersReducer,
  presetFilters: presetFiltersReducer,
  downloads: downloadsReducer,
  columnPreferences: persistReducer(columnPreferencesPersistConfig, columnPreferencesReducer),
});

const rootReducer: typeof appReducer = (state, action: Action) => {
  if (action.type === SESSION_EXPIRED_ACTION) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
