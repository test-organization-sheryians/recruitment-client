// src/features/Profile/api/profileApi.ts
import api from "@/config/axios";
import { Profile } from "@/types/profile";

export const updateProfile = async (data: Partial<Profile>) => {
  const res = await api.put("/api/candidate-profile/update-profile", data);
  return res.data; // your backend response
};
