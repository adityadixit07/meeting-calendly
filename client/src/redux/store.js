import { configureStore } from '@reduxjs/toolkit';
import authReducer from './userSlice';
import eventSlice from './eventSlice';
import dateSlice from './dateSlice';
import clientSlice from './clientSlice';
import adminSlice from './adminSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    event: eventSlice,
    date: dateSlice,
    client: clientSlice,
    admin: adminSlice
  },
});

// export const url="http://localhost:9889/api"
export const url="/api"
export default store
