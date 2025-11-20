import api from "@/config/axios";

export const getActiveJobRoles = async () => {
  const res = await api.get("/api/jobs/status/active");
  return res.data;
};
