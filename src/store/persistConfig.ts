import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'user', 'permissions', 'settings'],
};

export default persistConfig;
