import api from "@/config/axios";

export const deleteJobRole = async (id:string) => {
  const res = await api.delete(`/api/jobs/${id}`);
  return res.data;
};

