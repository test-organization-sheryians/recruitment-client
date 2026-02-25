import api from '@/config/axios';

export type JobQuestionPayload = {
  title: string;
  inputType: string;
  isRequired: boolean;
  options?: string[];
  description?: string;
};



/* ================= CREATE QUESTIONS ================= */

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

export const getJobQuestions = async (jobId: string) => {
  const res = await api.get(
    `/api/job-questions/getjobquestions/${jobId}`
  );
  return res.data.data;
};

/* ================= UPDATE QUESTION ================= */

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

export const deleteJobApplicationQuestion = async (questionId: string) => {
  const res = await api.delete(
    `/api/job-questions/deletejobquestion/${questionId}`
  );
  return res.data;
};