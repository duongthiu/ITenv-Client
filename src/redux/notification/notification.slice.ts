import { createSlice } from '@reduxjs/toolkit';
import { NotificationType } from '../../types/NotificationType';

type InitialState = {
  notifications: NotificationType[] | undefined;
  total: number;
};
const initialState: InitialState = {
  notifications: undefined,
  total: 0
};

export const notificationSlice = createSlice({
  initialState: initialState,
  name: 'notification',
  reducers: {
    setNotifications(state, action: { payload: NotificationType[] }) {
      state.notifications = action.payload;
    },
    addNotification(state, action: { payload: NotificationType }) {
      state?.notifications?.unshift(action.payload);
      state.total = state.total + 1;
    },
    seenNotificationAction(state, action: { payload: string }) {
      const index = state?.notifications?.findIndex((n) => n._id === action.payload);
      if (state.notifications && index !== undefined) {
        state.notifications[index].isSeen = true;
        state.total = state.total - 1 >= 0 ? state.total - 1 : 0;
      }
    },
    setTotalNotification(state, action) {
      state.total = action.payload;
    }
  }
});
export const { setNotifications, seenNotificationAction, setTotalNotification, addNotification } =
  notificationSlice.actions;
const reducer = notificationSlice.reducer;
export default reducer;
