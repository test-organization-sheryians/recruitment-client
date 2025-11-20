import api from "@/config/axios";
import { Profile } from "@/types/profile";

export const createProfile = async (data: Profile) => {
  const res = await api.post("/api/candidate-profile", data);
  return res.data;
};