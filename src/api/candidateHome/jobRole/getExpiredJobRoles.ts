import api from "@/config/axios";

export const getExpiredJobRoles = async () => {
  const res = await api.get("/api/jobs/status/expired");
  return res.data;
};
