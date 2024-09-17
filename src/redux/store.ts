import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { appSlice } from './app/app.slice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'app',
  storage,
  whiteList: ['app']
};
const rootReducer = combineReducers({
  app: appSlice.reducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
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
