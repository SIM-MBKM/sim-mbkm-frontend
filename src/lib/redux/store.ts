import { configureStore } from '@reduxjs/toolkit';
// import roleReducer from './roleSlice';
import { roleSlice } from './roleSlice';

export const store = configureStore({
  reducer: {
    role: roleSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 