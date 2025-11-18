import api from "@/config/axios/index";


export const getJobs = async (id?: string) => {
  const url = id ? `/api/jobs/${id}` : '/api/jobs';
  const res = await api.get(url);
  console.log("res.data", res.data);
  return res.data;
};


export const createJob = async (data: any) => {
  const res = await api.post("/api/jobs", data);
  return res.data;
};


export const updateJob = async (id: string, data: any) => {
  const res = await api.put(`/api/jobs/${id}`, data);
  return res.data;
};


export const deleteJob = async (id: string) => {
  const res = await api.delete(`/api/jobs/${id}`);
  return res.data;
};