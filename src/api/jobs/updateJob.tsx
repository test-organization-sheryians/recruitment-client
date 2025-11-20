import api from "@/config/axios";

export const updateJob = async (id: string, data: any) => {
  const res = await api.put(`/api/jobs/${id}`, data);
  return res.data;
};