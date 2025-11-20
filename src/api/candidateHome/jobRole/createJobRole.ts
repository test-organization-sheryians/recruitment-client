import api from "@/config/axios";

export const createJobRole = async (data: FormData) => {
  const res = await api.post("/api/jobs", data);
  return res.data;
};
