import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// 1. Define the User shape based on your SigninForm logic
interface User {
  id: string;
  email?: string;
  firstName: string;
  lastName?: string;
  role: string;
  isVerified: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Optional: If you use redux-persist, you might want to 
      // handle extra cleanup here, but standard state reset is enough.
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;