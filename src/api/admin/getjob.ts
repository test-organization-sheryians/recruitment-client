// config/jobRoleApi.ts
import api from "@/config/axios";

export const getJobRole = async () => {
  const response = await api.get("/api/roles");
  return response.data;
};
