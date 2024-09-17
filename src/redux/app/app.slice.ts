import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark'
}

type InitialStateProps = {
  theme: THEME;
};

const initialState: InitialStateProps = {
  theme: (localStorage.getItem('theme') as THEME) || THEME.LIGHT
};
export const appSlice = createSlice({
  initialState: initialState,
  name: 'app',
  reducers: {
    setTheme: (state, action: PayloadAction<THEME>) => {
      state.theme = action.payload;
    }
  }
});

export const { setTheme } = appSlice.actions;
const reducer = appSlice.reducer;
export default reducer;
