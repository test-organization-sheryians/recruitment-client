"use client"

import React, { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import AddQuestion from "./AddQuestion"
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import toast from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import {
  useGetJobApplicationQuestions,
  useCreateJobApplicationQuestions,
  useUpdateJobApplicationQuestion,
  useDeleteJobApplicationQuestion,
} from "../hooks/useJobApplicationQuestions"
import EditQuestionForm from "../ui/EditQuestionForm"
import { InputType } from "@/types/inputTypes"
import ScreeningQuestionDeleteButton from "../ui/ScreeningQuestionDeleteButton"

/* ================= ERROR HANDLER ================= */

const handleApiError = (error: any, fallback = "Something went wrong") => {
  window.scrollTo({ top: 0, behavior: "smooth" })

  const errors = error?.response?.data?.errors

  if (Array.isArray(errors) && errors.length > 0) {
    errors.forEach((msg: string) => toast.error(msg))
  } else {
    toast.error(error?.response?.data?.message || fallback)
  }
}

/* ================= TYPES ================= */

export interface ScreeningQuestion {
  _id: string
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

/* ================= COMPONENT ================= */

const ScreeningQuestions: React.FC = () => {
  const params = useParams()
  const router = useRouter()

  const jobId = typeof params?.jobId === "string" ? params.jobId : undefined
  if (!jobId) return <div className="p-10">Job ID not found</div>

  const [questions, setQuestions] = useState<ScreeningQuestion[]>([])
  const [editingQuestion, setEditingQuestion] =
    useState<ScreeningQuestion | null>(null)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const { data, isLoading, refetch } = useGetJobApplicationQuestions(jobId)

  const createMutation = useCreateJobApplicationQuestions()
  const updateMutation = useUpdateJobApplicationQuestion()
  const deleteMutation = useDeleteJobApplicationQuestion()

  const isCreating = createMutation.isPending
  const isUpdating = updateMutation.isPending

  /* ================= SAVE ================= */

  const handleSaveChanges = async () => {
    try {
      toast.loading("Saving changes...")
      await refetch()
      toast.dismiss()
      toast.success("All changes saved successfully 🎉")
      router.push(`/admin`)
    } catch (error) {
      toast.dismiss()
      toast.error("Failed to save changes")
    }
  }

  useEffect(() => {
    if (data?.data) {
      setQuestions(
        [...data.data].sort(
          (a: ScreeningQuestion, b: ScreeningQuestion) =>
            (a.order ?? 0) - (b.order ?? 0)
        )
      )
    }
  }, [data])

  /* ================= ADD ================= */

  const handleAddQuestion = (q: any) => {
    // ✅ frontend validation (UX improvement)
    if (!q.title || q.title.trim().length < 5) {
      toast.error("Question title must be at least 5 characters")
      return
    }

    if (
      ["radio", "checkbox", "dropdown"].includes(q.inputType) &&
      (!q.options || q.options.length === 0)
    ) {
      toast.error("Options are required for this question type")
      return
    }

    createMutation.mutate(
      {
        jobId,
        questions: [
          {
            ...q,
            options: q.options ?? [],
            order: questions.length + 1,
          },
        ],
      },
      {
        onSuccess: async () => {
          toast.success("Question added")
          setIsDrawerOpen(false)
          await refetch()
        },
        onError: (error: any) =>
          handleApiError(error, "Failed to add question"),
      }
    )
  }

  /* ================= EDIT ================= */

  const handleSaveEdit = () => {
    if (!editingQuestion) return

    updateMutation.mutate(
      {
        jobId,
        payload: {
          questionId: editingQuestion._id,
          ...editingQuestion,
        },
      },
      {
        onSuccess: async () => {
          toast.success("Question updated")
          setIsEditDialogOpen(false)
          await refetch()
        },
        onError: (error: any) =>
          handleApiError(error, "Update failed"),
      }
    )
  }

  /* ================= DELETE ================= */

  const deleteQuestion = (questionId: string) => {
    deleteMutation.mutate(
      { jobId, questionId },
      {
        onSuccess: async () => {
          toast.success("Question deleted")
          await refetch()
        },
        onError: (error: any) =>
          handleApiError(error, "Failed to delete question"),
      }
    )
  }

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="p-10 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 rounded-xl bg-gray-200 dark:bg-gray-800 animate-pulse"
          />
        ))}
      </div>
    )
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark">

      {/* HEADER */}
      <header className="sticky top-0 border-b bg-white dark:bg-[#111218]">
        <div className="px-6 py-3 flex justify-between">
          <h2 className="font-bold">Screening Questions</h2>

          <button
            onClick={handleSaveChanges}
            disabled={isCreating || isUpdating}
            className="px-5 py-2 bg-primary text-white rounded-xl disabled:opacity-50"
          >
            {isCreating || isUpdating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-[900px] mx-auto p-6 space-y-6">

        {questions.length === 0 ? (
          <div className="text-center p-10 border rounded-xl">
            <p className="font-bold text-lg">
              No screening questions yet 👀
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Start by adding your first question
            </p>

            <button
              onClick={() => setIsDrawerOpen(true)}
              disabled={isCreating}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-xl disabled:opacity-50"
            >
              Add Question
            </button>
          </div>
        ) : (
          <>
            {questions.map((q, index) => (
              <div
                key={q._id}
                className="border rounded-xl p-4 flex justify-between"
              >
                <div>
                  <p className="font-bold">
                    Q{index + 1}: {q.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {q.inputType} • {q.isRequired ? "Required" : "Optional"}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingQuestion(q)
                      setIsEditDialogOpen(true)
                    }}
                  >
                    <EditIcon />
                  </button>

                  <ScreeningQuestionDeleteButton
                    jobId={jobId}
                    questionId={q._id}
                    questionTitle={q.title}
                    onDeleted={async () => {
                      toast.success("Deleted")
                      await refetch()
                    }}
                  />
                </div>
              </div>
            ))}

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full border-dashed border p-4 rounded-xl"
            >
              <AddIcon /> Add Question
            </button>
          </>
        )}
      </main>

      {/* ADD */}
      {isDrawerOpen && (
        <AddQuestion
          onClose={() => setIsDrawerOpen(false)}
          onAdd={handleAddQuestion}
        />
      )}

      {/* EDIT */}
      {isEditDialogOpen && editingQuestion && (
        <Dialog open onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>

            <EditQuestionForm
              question={editingQuestion}
              onChange={(updated) =>
                setEditingQuestion((prev) =>
                  prev ? { ...prev, ...updated } : prev
                )
              }
            />

            <button
              onClick={handleSaveEdit}
              disabled={isUpdating}
              className="mt-4 bg-primary text-white px-4 py-2 rounded-xl w-full disabled:opacity-50"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </button>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ScreeningQuestions