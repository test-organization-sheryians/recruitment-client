import api from "@/config/axios"

/* ================= TYPES ================= */

export type JobQuestionPayload = {
  title: string
  inputType: string
  isRequired: boolean
  options?: string[]
  description?: string
  isKnockout?: boolean
  order?: number
  ratingValue?: number
  fileValue?: {
    name: string
    size: number
    type: string
  }
}

export type UpdateQuestionPayload = Partial<JobQuestionPayload> & {
  questionId: string
}

/* ================= ENDPOINTS ================= */

const BASE = "/api/job-questions"

/* ================= CREATE ================= */

export const createJobApplicationQuestions = async (
  jobId: string,
  questions: JobQuestionPayload[]
) => {
  const { data } = await api.post(`${BASE}/createjobquestions/${jobId}`, { questions })
  return data
}

/* ================= GET ================= */

export const getJobQuestions = async (jobId: string) => {
  const { data } = await api.get(`${BASE}/getjobquestions/${jobId}`)
  return data.data
}

/* ================= UPDATE ================= */

export const updateJobQuestion = async ({
  jobId,
  payload
}: {
  jobId: string;
  payload: UpdateQuestionPayload;
}) => {
  const { data } = await api.patch(`${BASE}/updatejobquestion/${jobId}`, payload)
  return data
}

/* ================= DELETE ================= */

export const deleteJobApplicationQuestion = async ({ 
  jobId, 
  questionId 
}: { 
  jobId: string; 
  questionId: string 
}) => {
  const { data } = await api.delete(
    `${BASE}/deletejobquestion/${jobId}`, 
    {
      data: { questionId } 
    }
  )
  return data
}