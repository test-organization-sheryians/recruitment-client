import api from "@/config/axios/index";

export const getJobs = async () => {
  const url = "/api/jobs";
  const res = await api.get(url);
  return res.data.data;  
};
