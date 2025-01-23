import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../api/axiosInstance";
import endpoints from "../api/endpoints";
import { toast } from "react-toastify";


export const fetchAllUsers = createAsyncThunk(
  "user/fetchAllUsers",
  async () => {
    try {
      const response = await axiosInstance.get(endpoints.ADMIN.GET_ALL_USERS);
      const nonAdminUsers = response.data.data.users.filter(user => user.role !== "admin");
      return nonAdminUsers;
    } catch (error) {
      toast.error("Failed to fetch users");
      return error.response.data;
    }
  }
);

export const blockUser = createAsyncThunk(
  "user/blockUser",
  async (userId) => {
    try {
      console.log("Blocking user with ID:", userId);
      const response = await axiosInstance.patch(endpoints.ADMIN.BLOCK_USER(userId),  { isBlocked: true } );
      toast.success(`${response.data.data.user.username} is blocked`);
      return response.data.data.user;
    } catch (error) {
      console.error("Failed to block user:", error.response ? error.response.data : error); 
      toast.error("Failed to block user");
      return error.response.data;
    }
  }
);

export const unblockUser = createAsyncThunk(
  "user/unblockUser",
  async (userId) => {
    try {
      const response = await axiosInstance.patch(endpoints.ADMIN.UNBLOCK_USER(userId), { isBlocked: false });
      toast.success(`${response.data.data.user.username} is unblocked`);
      return response.data.data.user;
    } catch (error) {
      toast.error("Failed to unblock user");
      return error.response.data;
    }
  }
);

const initialState = {
  isAuthenticated: localStorage.getItem('token') ? true : false,
  user: JSON.parse(localStorage.getItem('user')) || null,
  users: [],
  admin: localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')).role === 'admin': false,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      const user = action.payload.user[0];
      state.isAuthenticated = true;
      state.user = user;
      state.admin = user.role === 'admin';
      localStorage.setItem('token', action.payload.token); 
      localStorage.setItem('user', JSON.stringify(action.payload.user[0])); 
      localStorage.setItem('role', JSON.stringify(action.payload.user[0].role)); 
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.admin = false;
      localStorage.removeItem("token");
      localStorage.removeItem('user'); 
      localStorage.removeItem('role');
    },
   
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Block User
      .addCase(blockUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      })

      // Unblock User
      .addCase(unblockUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        state.users = state.users.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        );
      });
  },
});


export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
