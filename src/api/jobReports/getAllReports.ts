import api from "@/config/axios";
import { JobReport } from "@/types/jobReport";

export const getAllReports = async (): Promise<JobReport[]> => {
  const res = await api.get("/api/job-reports");
  return res.data.data;
};
