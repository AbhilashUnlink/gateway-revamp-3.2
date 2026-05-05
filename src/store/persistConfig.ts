export const storage = {
  getItem: (key: string): Promise<string | null> => {
    return Promise.resolve(window.localStorage.getItem(key));
  },
  setItem: (key: string, value: string): Promise<void> => {
    window.localStorage.setItem(key, value);
    return Promise.resolve();
  },
  removeItem: (key: string): Promise<void> => {
    window.localStorage.removeItem(key);
    return Promise.resolve();
  },
};

const persistConfig = {
  key: 'root',
  storage,
  // `columnPreferences` is persisted via its own nested persistReducer in
  // rootReducer.ts (only the `byScreen` slice survives reloads).
  whitelist: ['auth', 'user', 'permissions', 'settings', 'ui', 'filters', 'gatewayConfig'],
};

export default persistConfig;
