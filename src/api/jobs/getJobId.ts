// src/api/jobs/getJobById.ts
import api from "@/config/axios";
import { Job } from "@/types/Job";

export const getJobById = async (id: string): Promise<Job> => {
  const res = await api.get(`api/jobs/${id}`);
  console.log("API RAW RESPONSE:", res.data);
  return res.data.data;
};
