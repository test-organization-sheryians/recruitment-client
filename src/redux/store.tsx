import { configureStore } from "@reduxjs/toolkit";
import skillReducer from "./skills/skillSlice";

export const store = configureStore({
  reducer: {
    skill: skillReducer,
  },
});
