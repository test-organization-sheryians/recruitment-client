import { useMutation, useQuery } from "@tanstack/react-query"
import * as api from "@/api"

/* ================= GET ================= */

export const useGetJobApplicationQuestions = (jobId?: string) =>
  useQuery({
    queryKey: ["job-application-questions", jobId],
    queryFn: () => {
      if (!jobId) throw new Error("jobId is required")
      return api.getJobQuestions(jobId)
    },
    enabled: Boolean(jobId),
  })

/* ================= CREATE ================= */

type CreateQuestionsInput = {
  jobId: string
  questions: api.JobQuestionPayload[]
}

export const useCreateJobApplicationQuestions = () =>
  useMutation({
    mutationFn: ({ jobId, questions }: CreateQuestionsInput) =>
      api.createJobApplicationQuestions(jobId, questions),
  })

/* ================= UPDATE ================= */

type UpdateQuestionInput = {
  jobId: string
  payload: api.UpdateQuestionPayload
}

export const useUpdateJobApplicationQuestion = () => {
  return useMutation({
    mutationFn: ({ jobId, payload }: UpdateQuestionInput) =>
      api.updateJobQuestion({ jobId, payload }),
  })
}

/* ================= DELETE ================= */

type DeleteQuestionInput = {
  jobId: string;
  questionId: string;
}

export const useDeleteJobApplicationQuestion = () =>
  useMutation({
    mutationFn: (input: DeleteQuestionInput) =>
      api.deleteJobApplicationQuestion(input), // Passes { jobId, questionId }
  })