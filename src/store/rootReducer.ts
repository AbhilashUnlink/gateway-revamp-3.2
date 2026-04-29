import { combineReducers, type Action } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import permissionReducer from './slices/permissionSlice';
import settingsReducer from './slices/settingsSlice';
import transactionsReducer from './slices/transactionsSlice';
import transactionDetailsReducer from './slices/transactionDetailsSlice';
import drawersReducer from './slices/drawerSlice';
import { SESSION_EXPIRED_ACTION } from '@/utils/forceLogout';

const appReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  ui: uiReducer,
  permissions: permissionReducer,
  settings: settingsReducer,
  transactions: transactionsReducer,
  transactionDetails: transactionDetailsReducer,
  drawers: drawersReducer,
});

const rootReducer: typeof appReducer = (state, action: Action) => {
  if (action.type === SESSION_EXPIRED_ACTION) {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export default rootReducer;
