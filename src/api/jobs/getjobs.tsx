import api from "@/config/axios/index";


export const getJobs = async (id?: string) => {
  const url = id ? `/api/jobs/${id}` : '/api/jobs';
  const res = await api.get(url);
  console.log("res.data", res.data);
  return res.data;
};
