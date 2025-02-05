import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slices/authSlice";
import bookingReducer from "../slices/bookingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingReducer,
  },
});

export default store;
