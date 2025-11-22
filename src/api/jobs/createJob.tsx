import api from "@/config/axios";

export const createJob = async (data: FormData) => {
  const res = await api.post("/api/jobs", data);
  return res.data;
};
