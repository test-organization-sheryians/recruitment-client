import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthLoading = false;
    },
    setAuthLoading: (state, action) => {
      state.isAuthLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthLoading = false;
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
