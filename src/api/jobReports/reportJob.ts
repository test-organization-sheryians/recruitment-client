import api from "@/config/axios";

export interface ReportJobPayload {
  reason: "spam" | "fake" | "wrong_info" | "other";
  description?: string;
}

export const reportJob = async (data: ReportJobPayload & { jobId: string }) => {
  const response = await api.post(`/api/job-reports`, data);
  return response.data;
};
