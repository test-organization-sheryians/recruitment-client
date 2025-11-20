import api from "@/config/axios";

export const getJobCategoryById = async (id: string) => {
  const res = await api.get(`/api/job-categories/${id}`);
  return res.data;
};
