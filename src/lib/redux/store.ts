import { configureStore } from '@reduxjs/toolkit';
// import roleReducer from './roleSlice';
import { roleSlice } from './roleSlice';
import userDataReducer from './userDataSlice';

export const store = configureStore({
  reducer: {
    role: roleSlice.reducer,
    userData: userDataReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 