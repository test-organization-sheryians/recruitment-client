import api from "@/config/axios";

export const createProfile = async (data: any) => {
  const response = await api.post("/api/candidate-profile", data);
  return response.data;
};
