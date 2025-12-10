import api from "@/config/axios/index";

export const getJobs = async (id?: string) => {
  const url = "/api/jobs";
  const res = await api.get(`${url}/${id}`);
  return res.data.data; 
};
