// src/features/auth/slice.ts (or wherever you keep it)
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Proper user shape from your backend
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName?: string;
  role?: "admin" | "candidate" | "user"; 
}

interface AuthState {
  user: User | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

// Export actions
export const { setUser, setToken, logout } = authSlice.actions;

// Export reducer
export default authSlice.reducer;