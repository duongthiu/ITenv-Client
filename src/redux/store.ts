import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import appSlice from './app/app.slice';
import { friendSlice } from './friend/friend.slice';
import { messageSlice } from './message/message.slice';
import { notificationSlice } from './notification/notification.slice';
import { userSlice } from './user/user.slice';
import { tagSlice } from './tag/tag.slice';

const appPersistConfig = {
  key: 'app',
  storage,
  whitelist: ['theme', 'isChatBoxVisible']
};

const userPersistConfig = {
  key: 'user',
  storage,
  whitelist: ['isLogged', 'token', 'user._id']
};

// Combine reducers with persisted slices
const rootReducer = combineReducers({
  app: persistReducer(appPersistConfig, appSlice),
  user: persistReducer(userPersistConfig, userSlice.reducer),
  conversation: messageSlice.reducer,
  notification: notificationSlice.reducer,
  friend: friendSlice.reducer,
  tag: tagSlice.reducer
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
