import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { appSlice } from './app/app.slice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userSlice } from './user/user.slice';

// Persist configuration for the app slice (only store 'theme')
const appPersistConfig = {
  key: 'app',
  storage,
  whitelist: ['theme']
};

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['isLogged', 'token'] // Only persist the isLogged and token fields in the user slice
};

// Combine reducers with persisted slices
const rootReducer = combineReducers({
  app: persistReducer(appPersistConfig, appSlice.reducer),
  user: persistReducer(userPersistConfig, userSlice.reducer)
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['register', 'rehydrate', 'payload'],
        // Ignore these paths in the state
        ignoredPaths: ['common.socket']
      }
    })
});

export const persistor = persistStore(store);
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
