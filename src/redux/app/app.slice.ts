import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark'
}

export interface AppState {
  theme: THEME;
  isChatBoxVisible: boolean;
}

const initialState: AppState = {
  theme: (localStorage.getItem('theme') as THEME) || THEME.LIGHT,
  isChatBoxVisible: localStorage.getItem('isChatBoxVisible') === 'false' ? false : true
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<THEME>) => {
      state.theme = action.payload;
      localStorage.setItem('theme', action.payload);
    },
    toggleChatBox: (state) => {
      state.isChatBoxVisible = !state.isChatBoxVisible;
      localStorage.setItem('isChatBoxVisible', String(state.isChatBoxVisible));
    }
  }
});

export const { setTheme, toggleChatBox } = appSlice.actions;
export default appSlice.reducer;
