import api from "@/config/axios";

export const getAllJobRoles = async () => {
  const res = await api.get("/api/jobs");
  return res.data;
};
