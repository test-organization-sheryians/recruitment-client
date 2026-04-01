import { useMutation, useQuery } from "@tanstack/react-query"
import * as api from "./jobApplicationQuestions"

/* ================= GET ================= */

export const useGetJobApplicationQuestions = (jobId?: string) => {
  return useQuery({
    queryKey: ["job-application-questions", jobId],
    queryFn: () => api.getJobQuestions(jobId!),
    enabled: !!jobId,
    retry: 0,
  })
}

/* ================= CREATE ================= */

export const useCreateJobApplicationQuestions = () => {
  return useMutation({
    mutationKey: ["create-job-application-questions"],
    mutationFn: ({
      jobId,
      questions,
    }: {
      jobId: string
      questions: api.JobQuestionPayload[]
    }) => api.createJobQuestions(jobId, questions),
    retry: 0,
  })
}

/* ================= UPDATE ================= */

export const useUpdateJobApplicationQuestion = () => {
  return useMutation({
    mutationKey: ["update-job-application-question"],
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string
      payload: api.UpdateQuestionPayload
    }) => api.updateJobQuestion(jobId, payload),
    retry: 0,
  })
}

/* ================= DELETE ================= */

export const useDeleteJobApplicationQuestion = () => {
  return useMutation({
    mutationKey: ["delete-job-application-question"],
    mutationFn: ({
      jobId,
      questionId,
    }: {
      jobId: string
      questionId: string
    }) => api.deleteJobQuestion(jobId, questionId),
    retry: 0,
  })
}
