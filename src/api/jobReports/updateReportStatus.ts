import api from "@/config/axios";
import { JobReport } from "@/types/jobReport";

export type ReportStatus = "pending" | "reviewed" | "resolved";

export const updateReportStatus = async (
  id: string,
  status: ReportStatus,
): Promise<JobReport> => {
  const res = await api.put(`/api/job-reports/${id}`, { status });
  return res.data.data;
};
