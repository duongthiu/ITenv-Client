import { createSlice } from '@reduxjs/toolkit';
import { TagType } from '../../types/TagType';

type InitialState = {
  tags: TagType[] | undefined;
  total: number;
};
const initialState: InitialState = {
  tags: undefined,
  total: 0
};

export const tagSlice = createSlice({
  initialState: initialState,
  name: 'tags',
  reducers: {
    setTags(state, action: { payload: TagType[] }) {
      state.tags = action.payload;
    }
  }
});
export const { setTags } = tagSlice.actions;
const reducer = tagSlice.reducer;
export default reducer;
