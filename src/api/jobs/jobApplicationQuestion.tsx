import api from '@/config/axios';

export type JobQuestionPayload = {
  title: string;
  inputType: string;
  isRequired: boolean;
  options?: string[];
  description?: string;
};



/* ================= CREATE QUESTIONS ================= */
// POST /api/job-application-questions/createjobquestions/:id
export const createJobApplicationQuestions = async (
  jobId: string,
  payload: JobQuestionPayload
) => {
  const res = await api.post(
    `/api/job-questions/createjobquestions/${jobId}`,
    payload
  );
  return res.data;
};

/* ================= GET QUESTIONS ================= */
// GET /api/job-application-questions/getjobquestions/:id
export const getJobQuestions = async (jobId: string) => {
  const res = await api.get(
    `/api/job-questions/getjobquestions/${jobId}`
  );
  return res.data.data;
};

/* ================= UPDATE QUESTION ================= */
// PATCH /api/job-application-questions/updatejobquestion/:id
export const updateJobApplicationQuestion = async (
  questionId: string,
  payload: JobQuestionPayload
) => {
  const res = await api.patch(
    `/api/job-questions/updatejobquestion/${questionId}`,
    payload
  );
  return res.data;
};

/* ================= DELETE QUESTION ================= */
// DELETE /api/job-application-questions/deletejobquestion/:id
export const deleteJobApplicationQuestion = async (questionId: string) => {
  const res = await api.delete(
    `/api/job-questions/deletejobquestion/${questionId}`
  );
  return res.data;
};