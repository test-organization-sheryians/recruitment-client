import { InputType } from "@/types/inputTypes"
import axios from "axios"

const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api",
  withCredentials: true,
})

/* ================= INTERCEPTOR ================= */

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

/* ================= TYPES ================= */

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

/* ================= API FUNCTIONS ================= */
/* NOTE: routes are mounted on /api/job-questions */

export const getJobQuestions = async (jobId: string) => {
  if (!jobId) throw new Error("Job ID is required")

  const res = await API.get(
    `/job-questions/getjobquestions/${jobId}`
  )
  return res.data
}

export const createJobQuestions = async (
  jobId: string,
  questions: JobQuestionPayload[]
) => {
  if (!jobId) throw new Error("Job ID is required")

  const res = await API.post(
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

  const res = await API.patch(
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

  const res = await API.delete(
    `/job-questions/deletejobquestion/${jobId}`,
    {
      data: { questionId },
    }
  )
  return res.data
}
