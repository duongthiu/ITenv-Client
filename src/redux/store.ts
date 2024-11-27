import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { appSlice } from './app/app.slice';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userSlice } from './user/user.slice';
import { messageSlice } from './message/message.slice';
import { friendSlice } from './app/friend.slice';

const appPersistConfig = {
  key: 'app',
  storage,
  whitelist: ['theme']
};

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['isLogged', 'token', 'user._id']
};

// Combine reducers with persisted slices
const rootReducer = combineReducers({
  app: persistReducer(appPersistConfig, appSlice.reducer),
  user: persistReducer(userPersistConfig, userSlice.reducer),
  conversation: messageSlice.reducer,
  friend: friendSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
        ignoredActionPaths: ['register', 'rehydrate', 'payload', 'payload.socketConnection'],
        ignoredPaths: ['user.socketConnection']
      }
    })
});

export const persistor = persistStore(store);
export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
