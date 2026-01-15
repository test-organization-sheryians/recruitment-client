import api from "@/config/axios";
import type { JobQuestion, ApiResponse } from "@/types/JobQuestion";

// Create questions for a job (backend expects POST /api/job-questions/createjobquestions/:id with { questions })
export const addJobQuestions = async (jobId: string, questions: JobQuestion[]) => {
  const res = await api.post<ApiResponse<JobQuestion[]>>(`/api/job-questions/createjobquestions/${jobId}`, { questions });
  return res.data as ApiResponse<JobQuestion[]>;
};

// Get questions for a job (backend: GET /api/job-questions/getjobquestions/:id)
export const getJobQuestions = async (jobId: string) => {
  const res = await api.get<ApiResponse<JobQuestion[]>>(`/api/job-questions/getjobquestions/${jobId}`);
  return res.data as ApiResponse<JobQuestion[]>;
};

// Update a single question (backend: POST /api/job-questions/updatejobquestion/:jobId with { questionId, ...data })
export const updateJobQuestion = async (jobId: string, questionId: string, data: Partial<JobQuestion>) => {
  const payload = { questionId, ...data };
  const res = await api.post<ApiResponse<JobQuestion>>(`/api/job-questions/updatejobquestion/${jobId}`, payload);
  return res.data as ApiResponse<JobQuestion>;
};

// NOTE: backend currently doesn't expose a delete endpoint for job-questions in the updated controller.
// Keep the old delete call here; callers should handle failures gracefully.
export const deleteJobQuestion = async (jobId: string, questionId: string) => {
  const res = await api.post<ApiResponse<null>>(`/api/job-questions/deletejobquestion/${jobId}`, { questionId });
  return res.data as ApiResponse<null>;
};

