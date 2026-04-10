import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  firstName: string;
  lastName?: string;
  email?: string;
  role: string;
  isVerified:boolean
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isAuthLoading = false;
    },
    setAuthLoading(state, action: PayloadAction<boolean>) {
      state.isAuthLoading = action.payload;
    },
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthLoading = false;
    },
  },
});

export const { setUser, setAuthLoading, setToken, logout } = authSlice.actions;
export default authSlice.reducer;
