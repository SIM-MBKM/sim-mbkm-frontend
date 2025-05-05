import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'MAHASISWA' | 'DOSEN PEMBIMBING' | 'ADMIN' | 'LO-MBKM';

interface RoleState {
  role: UserRole | null;
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  role: null,
  loading: false,
  error: null,
};

export const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setRole: (state, action: PayloadAction<UserRole>) => {
      state.role = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearRole: (state) => {
      state.role = null;
    },
  },
});

export const { setRole, setLoading, setError, clearRole } = roleSlice.actions;

export default roleSlice.reducer; 