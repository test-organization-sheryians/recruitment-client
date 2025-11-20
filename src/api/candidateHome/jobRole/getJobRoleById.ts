import api from "@/config/axios";

export const getJobRoleById = async (id: string) => {
  const res = await api.get(`/api/jobs/${id}`);
  return res.data;
};
