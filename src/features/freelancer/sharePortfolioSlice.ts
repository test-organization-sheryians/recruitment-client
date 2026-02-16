"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { freelancerApi, type FreelancerProfile } from "@/api/freelancerApi";

interface ShareState {
  profiles: FreelancerProfile[];
  loading: boolean;
  error: string | null;
  shareLink: string | null;
}

const initialState: ShareState = {
  profiles: [],
  loading: false,
  error: null,
  shareLink: null,
};

export const fetchSharedPortfolio = createAsyncThunk(
  "freelancer/fetchSharedPortfolio",
  async (shareId: string) => {
    const response = await freelancerApi.getSharedPortfolio(shareId);
    return response;
  },
);

const sharePortfolioSlice = createSlice({
  name: "freelancer/sharePortfolio",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSharedPortfolio.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSharedPortfolio.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload.data || [];
      })
      .addCase(fetchSharedPortfolio.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch profiles";
      });
  },
});

export const { clearError } = sharePortfolioSlice.actions;
export default sharePortfolioSlice.reducer;
