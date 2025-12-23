// api/jobs/updateJobStatus.ts
import api from "@/config/axios";
import { Job } from "@/types/Job";

export const updateJobStatus = async (jobId: string, status: string): Promise<Job> => {
  const response = await api.patch(`/jobs/${jobId}/status`, { status });
  return response.data.data;
};
