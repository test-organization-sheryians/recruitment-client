import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSkills = createAsyncThunk(
  "skills/fetch",
  async () => {
    const res = await axios.get("/skills");
    return res.data.data;
  }
);

export const addSkill = createAsyncThunk(
  "skills/add",
  async (name) => {
    const res = await axios.post("/skills ",{ name });
    return res.data.data;
  }
);

export const deleteSkill = createAsyncThunk(
  "skills/delete",
  async (id) => {
    await axios.delete("/skills/${id}");
    return id;
  }
);

const initialState = {
  skills: [],     // 🟢 FIXED
  loading: false,
  error: null,
};

const skillSlice = createSlice({
  name: "skill",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false;
        state.skills = action.payload;
      })
      .addCase(addSkill.fulfilled, (state, action) => {
        state.skills.push(action.payload);
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.skills = state.skills.filter((s) => s._id !== action.payload);
      });
  },
});

export default skillSlice.reducer;
