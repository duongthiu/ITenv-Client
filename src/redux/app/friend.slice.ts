import { createSlice } from '@reduxjs/toolkit';
import { FriendType } from '../../types/FriendType';

type InitialState = {
  friendRequests: FriendType[];
  total: number;
};
const initialState: InitialState = {
  friendRequests: [],
  total: 0
};

export const friendSlice = createSlice({
  initialState: initialState,
  name: 'friend',
  reducers: {
    setFriendRequests(state, action) {
      state.friendRequests = action.payload;
    },
    addFriendRequest(state, action: { payload: FriendType }) {
      state.friendRequests.push(action.payload);
      state.total = state.total + 1;
    },
    removeFriendRequest(state, action: { payload: string }) {
      state.friendRequests = state.friendRequests.filter((friend) => friend._id !== action.payload);
      state.total = state.total - 1;
    },
    setTotalFriendRequest(state, action) {
      state.total = action.payload;
    }
  }
});
export const { setFriendRequests, addFriendRequest, removeFriendRequest, setTotalFriendRequest } = friendSlice.actions;
const reducer = friendSlice.reducer;
export default reducer;
