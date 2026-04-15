import api from "@/config/axios";

export const getProfile = async () => {
  const response = await api.get("/api/admin-profile");
  return response.data.data;
};
