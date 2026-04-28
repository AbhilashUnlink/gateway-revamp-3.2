import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import uiReducer from './slices/uiSlice';
import permissionReducer from './slices/permissionSlice';
import settingsReducer from './slices/settingsSlice';
import transactionsReducer from './slices/transactionsSlice';
import transactionDetailsReducer from './slices/transactionDetailsSlice';
import drawersReducer from './slices/drawerSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  ui: uiReducer,
  permissions: permissionReducer,
  settings: settingsReducer,
  transactions: transactionsReducer,
  transactionDetails: transactionDetailsReducer,
  drawers: drawersReducer,
});

export default rootReducer;
