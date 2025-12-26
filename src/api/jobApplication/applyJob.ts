

import api from "@/config/axios"


export type ApplyJobVariables = {
  jobId: string
  message?: string
  resumeUrl?: string
}

export type ApplyJobResponse = {
  message: string
}

export async function applyJob(
  payload: ApplyJobVariables
): Promise<ApplyJobResponse> {
  const res = await api.post("/api/job-apply", payload)
  return res.data
}
