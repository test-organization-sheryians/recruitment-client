import api from "@/config/axios";
import { JobReport } from "@/types/jobReport";

export const getMyReports = async (): Promise<JobReport[]> => {
  const res = await api.get("/api/job-reports/get-my-reports");
  return res.data.data;
};
