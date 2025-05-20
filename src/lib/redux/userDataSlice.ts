import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../api/services';

// export type UserRole = 'MAHASISWA' | 'DOSEN PEMBIMBING' | 'ADMIN' | 'LO-MBKM';

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

export const userDataSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    setUserLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, setUserLoading, setUserError, clearUser } = userDataSlice.actions;

export default userDataSlice.reducer; 