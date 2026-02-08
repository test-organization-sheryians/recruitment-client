import api from "@/config/axios";

export const deleteJob = async (id: string) => {
  const res = await api.delete(`/api/jobs/${id}`);
  return res.data;
};