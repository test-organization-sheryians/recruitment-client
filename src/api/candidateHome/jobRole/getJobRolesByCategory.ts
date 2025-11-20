import api from "@/config/axios";

export const getJobRolesByCategory = async (categoryId: string | number) => {
  const res = await api.get(`/api/jobs/category/${categoryId}`);
  return res.data;
};
