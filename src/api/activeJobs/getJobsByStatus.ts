// api/jobs/getJobsByStatus.ts
import api from "@/config/axios";
import { Job } from "@/types/Job";

export const getJobsByStatus = async (status: string): Promise<Job[]> => {
  const response = await api.get(`/jobs/filter/${status}`);
  return response.data.data || [];
};
