import api from "@/config/axios";

export const createJob = async (data: Record<string, unknown>) => {
  const res = await api.post("/api/jobs", data);
  return res.data;
};
