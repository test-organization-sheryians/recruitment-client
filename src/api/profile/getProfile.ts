import api from "@/config/axios";

export const getProfile = async () => {
  const response = await api.get("/api/candidate-profile/get-profile");
  return response.data;
};
