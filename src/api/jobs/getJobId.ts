import api from "@/config/axios";
import { Job } from "@/types/Job";

export const getJobById = async (id: string): Promise<Job> => {
  const res = await api.get(`/api/jobs/${id}`);
  return res.data?.data;
};
