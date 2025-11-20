import api from "@/config/axios";

export const createJobCategory = async (data: FormData) => {
  const res = await api.post("/api/job-categories", data);
  return res.data;
};
