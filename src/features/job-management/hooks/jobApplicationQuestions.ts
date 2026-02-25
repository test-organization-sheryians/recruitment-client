import { InputType } from "@/types/inputTypes"
import api from '@/config/axios'

export type JobQuestionPayload = {
  title: string
  description?: string
  inputType: InputType
  options?: string[]
  isRequired: boolean
  isKnockout: boolean
  order?: number

  // ✅ ADD THESE (for UI preview fields)
  ratingValue?: number
  fileValue?: {
    name: string
    size: number
    type: string
  }
}


export interface UpdateQuestionPayload {
  questionId: string
  title: string
  description?: string
  inputType: InputType
  options?: string[]
  isRequired: boolean
  isKnockout: boolean
  order?: number

  ratingValue?: number
  fileValue?: {
    name: string
    size: number
    type: string
}
}

/* ================= api FUNCTIONS ================= */
/* NOTE: routes are mounted on /api/job-questions */

export const getJobQuestions = async (jobId: string) => {
  if (!jobId) throw new Error("Job ID is required")

  const res = await api.get(
    `/job-questions/getjobquestions/${jobId}`
  )
  return res.data
}

export const createJobQuestions = async (
  jobId: string,
  questions: JobQuestionPayload[]
) => {
  if (!jobId) throw new Error("Job ID is required")

  const res = await api.post(
    `/job-questions/createjobquestions/${jobId}`,
    { questions }
  )
  return res.data
}

export const updateJobQuestion = async (
  jobId: string,
  payload: UpdateQuestionPayload
) => {
  if (!jobId) throw new Error("Job ID is required")

  const res = await api.patch(
    `/job-questions/updatejobquestion/${jobId}`,
    payload
  )
  return res.data
}

export const deleteJobQuestion = async (
  jobId: string,
  questionId: string
) => {
  if (!jobId || !questionId) {
    throw new Error("Job ID and Question ID are required")
  }

  const res = await api.delete(
    `/job-questions/deletejobquestion/${jobId}`,
    {
      data: { questionId },
    }
  )
  return res.data
}
