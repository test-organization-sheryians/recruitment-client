import api from "@/config/axios";

export const createProfile = async (data: any) => {
  const res = await api.post("/api/candidate-profile", data);
  return res.data;
};