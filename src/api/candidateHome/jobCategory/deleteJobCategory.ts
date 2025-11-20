import api from "@/config/axios";

export const deleteJobCategory = async (id: string) => {
  const res = await api.delete(`/api/job-categories/${id}`);
  return res.data;
};
