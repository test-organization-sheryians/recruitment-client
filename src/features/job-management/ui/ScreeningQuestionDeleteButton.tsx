"use client"

import { useRouter } from "next/navigation"
import ConfirmDeleteDialog from "../ui/ConfirmDeleteDialog"
import { useDeleteJobApplicationQuestion } from "../hooks/useJobApplicationQuestions"
import {  Trash} from "lucide-react";

export default function ScreeningQuestionDeleteButton({
  jobId,
  questionId,
  questionTitle,
  onDeleted,
}: {
  jobId: string
  questionId: string
  questionTitle?: string
  onDeleted?: () => void
}) {
  const router = useRouter()
  const deleteMutation = useDeleteJobApplicationQuestion()

  return (
    <ConfirmDeleteDialog
      title={`Delete ${questionTitle || "Question"}?`}
      consequences={["This screening question will be removed"]}
      onDelete={async () => {
        try {
          await deleteMutation.mutateAsync({ jobId, questionId })
          return true // ✅ MUST RETURN BOOLEAN
        } catch (e) {
          return false
        }
      }}
      onDeleted={onDeleted}
      redirectAfterDelete={() => {
        // ✅ same UX like your JobDeleteButton
        router.refresh()
      }}
    />
  )
}
