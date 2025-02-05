import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { newBookingApi, userBookingsApi } from '../../api/BookingApi';

// Async Thunks
export const createBooking = createAsyncThunk('bookings/create', async (data, { rejectWithValue }) => {
  try {
    const response = await newBookingApi(data);
    return response;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const fetchUserBookings = createAsyncThunk('bookings/user', async (_, { rejectWithValue }) => {
  try {
    const response = await userBookingsApi();
    return response.bookings;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: { bookings: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => { state.loading = true; })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings.push(action.payload.booking);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.bookings = action.payload;
      });
  }
});

export default bookingSlice.reducer;
