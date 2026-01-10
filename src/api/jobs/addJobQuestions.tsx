import api from "@/config/axios";
import type { JobQuestion, ApiResponse } from "@/types/JobQuestion";

export const addJobQuestions = async (jobId: string, questions: JobQuestion[]) => {
  const res = await api.post<ApiResponse<JobQuestion[]>>("/api/job-questions", { jobId, questions });
  return res.data as ApiResponse<JobQuestion[]>;
};

export const getJobQuestions = async (jobId: string) => {
  const res = await api.get<ApiResponse<JobQuestion[]>>(`/api/job-questions/job/${jobId}`);
  return res.data as ApiResponse<JobQuestion[]>;
};

export const updateJobQuestion = async (id: string, data: Partial<JobQuestion>) => {
  const res = await api.put<ApiResponse<JobQuestion>>(`/api/job-questions/${id}`, data);
  return res.data as ApiResponse<JobQuestion>;
};

export const deleteJobQuestion = async (id: string) => {
  const res = await api.delete<ApiResponse<null>>(`/api/job-questions/${id}`);
  return res.data as ApiResponse<null>;
};

