// config/jobRoleApi.ts
import api from "@/config/axios";

export const createJobRole = async (data: FormData) => {
  const response = await api.post("/api/roles", data);
  return response.data;
};
