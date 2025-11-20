import api from "@/config/axios";

export const createJob = async (data: any) => {
  const res = await api.post("/api/jobs", data);
  return res.data;
};
