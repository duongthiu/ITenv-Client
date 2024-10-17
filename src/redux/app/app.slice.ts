import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export enum THEME {
  LIGHT = 'light',
  DARK = 'dark'
}
type ModalType = {
  isOpen: boolean;
  status: 'success' | 'error' | 'warning';
  title: string;
  description?: string;
};
type InitialStateProps = {
  theme: THEME;
  modal: ModalType;
};

const initialState: InitialStateProps = {
  theme: (localStorage.getItem('theme') as THEME) || THEME.LIGHT,
  modal: {
    isOpen: false,
    status: 'success',
    title: '',
    description: ''
  }
};
export const appSlice = createSlice({
  initialState: initialState,
  name: 'app',
  reducers: {
    setTheme: (state, action: PayloadAction<THEME>) => {
      state.theme = action.payload;
    },
    openSuccessModal: (state, action: PayloadAction<Pick<ModalType, 'description'>>) => {
      state.modal.status = 'success';
      state.modal.isOpen = true;
      state.modal.title = 'Success';
      state.modal.description = action.payload.description || 'Successfully !!!';
    },
    openErrorModal: (state, action: PayloadAction<Pick<ModalType, 'description'>>) => {
      state.modal.status = 'error';
      state.modal.isOpen = true;
      state.modal.title = 'Error';
      state.modal.description = action.payload.description || 'Somethings went wrong !!!';
    },
    openWarningModal: (state, action: PayloadAction<Pick<ModalType, 'description'>>) => {
      state.modal.status = 'warning';
      state.modal.isOpen = true;
      state.modal.title = 'Warning';
      state.modal.description = action.payload.description || 'Somethings went wrong !!!cessfully';
    },

    setCloseModal: (state) => {
      state.modal.isOpen = false;
    }
  }
});

export const { setTheme, openSuccessModal, openErrorModal, openWarningModal, setCloseModal } = appSlice.actions;
const reducer = appSlice.reducer;
export default reducer;
