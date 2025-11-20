import api from "@/config/axios";

export const updateJobCategory = async (id: string, data: FormData) => {
  const res = await api.put(`/api/job-categories/${id}`, data);
  return res.data;
};
