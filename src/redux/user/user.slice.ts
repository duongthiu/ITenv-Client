import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserType } from '../../types/UserType';
import { getCurrentUser } from '../../services/user/user.service';
import { Socket } from 'socket.io-client';

type InitialState = {
  user: UserType | null;
  token: string | '';
  isLogged: boolean;
  loading: boolean;
  error: string;
  socketConnection?: Socket;
};

const initialState: InitialState = {
  user: null,
  token: '',
  isLogged: false,
  loading: false,
  error: '',
  socketConnection: undefined
};

export const getUser = createAsyncThunk<UserType, string | undefined, { rejectValue: string }>(
  'user/getUser',
  async (_param, { rejectWithValue }) => {
    try {
      const data = await getCurrentUser();
      return data as UserType;
    } catch (error: any) {
      return rejectWithValue(error?.response?.data?.message || error.message);
    }
  }
);
export const userSlice = createSlice({
  initialState: initialState,
  name: 'user',
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem('accessToken', action.payload);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => { 
      state.loading = action.payload
    },
    setLogin: (state, action: PayloadAction<boolean>) => {
      state.isLogged = action.payload;
    },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLogged = false;
      state.token = '';
      localStorage.setItem('accessToken', '');
    },
    setSocketConnection: (state, action: PayloadAction<any>) => {
      state.socketConnection = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action: PayloadAction<UserType>) => {
      state.loading = false;
      state.user = action.payload;
      state.error = '';
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.loading = false;
      state.user = null;

      state.error = action.payload as string;
    });
  }
});

export const { setLogin, setToken, setUser, logout, setSocketConnection, setLoading } = userSlice.actions;
export default userSlice.reducer;
