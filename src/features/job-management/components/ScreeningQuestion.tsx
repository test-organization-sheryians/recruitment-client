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

type useGetJobApplicationQuestions = {
  title: string
  description?: string
  inputType: InputType
  isRequired: boolean
  options?: string[]
  isKnockout: boolean
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

  // ✅ logic same: refetch + toast + redirect
  const handleSaveChanges = async () => {
    try {
      await refetch()
      toast.success("All changes saved successfully")
      router.push(`/Crew/getJob`)
    } catch (error) {
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

  /* ================= ACTIONS (NO CHANGE) ================= */

  const handleAddQuestion = (q: useGetJobApplicationQuestions) => {
    createMutation.mutate(
      {
        jobId,
        questions: [
          {
            title: q.title,
            description: q.description,
            inputType: q.inputType,
            options: q.options ?? [],
            isRequired: q.isRequired,
            isKnockout: q.isKnockout,
            order: questions.length + 1,
            ratingValue:
              q.inputType === "rating" ? (q.ratingValue ?? 0) : undefined,
            fileValue: q.inputType === "file" ? q.fileValue : undefined,
          },
        ],
      },
      {
        onSuccess: async () => {
          toast.success("Question added")
          setIsDrawerOpen(false)
          await refetch()
        },
        onError: () => toast.error("Failed to add question"),
      }
    )
  }

  const handleSaveEdit = () => {
    if (!editingQuestion) return

    updateMutation.mutate(
      {
        jobId,
        payload: {
          questionId: editingQuestion._id,
          title: editingQuestion.title,
          description: editingQuestion.description || "",
          inputType: editingQuestion.inputType,
          options: editingQuestion.options ?? [],
          isRequired: editingQuestion.isRequired,
          isKnockout: editingQuestion.isKnockout || false,
          order: editingQuestion.order,
          ratingValue:
            editingQuestion.inputType === "rating"
              ? (editingQuestion.ratingValue ?? 0)
              : undefined,
          fileValue:
            editingQuestion.inputType === "file"
              ? editingQuestion.fileValue
              : undefined,
        },
      },
      {
        onSuccess: async () => {
          toast.success("Question updated")
          setIsEditDialogOpen(false)
          await refetch()
        },
        onError: (err: unknown) => {
          console.error(err)
          toast.error("Update failed")
        },
      }
    )
  }

  const deleteQuestion = (questionId: string) => {
    deleteMutation.mutate(
      { jobId, questionId },
      {
        onSuccess: async () => {
          toast.success("Question deleted")
          await refetch()
        },
        onError: () => toast.error("Failed to delete question"),
      }
    )
  }

  if (isLoading) return <div className="p-10">Loading...</div>

  /* ================= UI (IMPROVED ONLY) ================= */

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark transition-colors">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#dbdde6] dark:border-gray-800 bg-white/90 dark:bg-[#111218]/90 backdrop-blur">
        <div className="px-6 md:px-10 py-3 flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white">
              AdminPanel
            </h2>
            <div className="flex flex-wrap items-center text-xs md:text-sm text-[#616889] mt-0.5 gap-1">
              {/* Jobs */}
              <button
                type="button"
                onClick={() => router.push("/Crew/getJob")}
                className="hover:text-primary transition font-medium cursor-pointer"
              >
                Jobs
              </button>

              <span>/</span>
                   <span className="font-bold text-gray-900 dark:text-white">
                     Screening Questions </span>
              <span>/</span>

              {/* Current Job */}
              <span
                className="font-bold text-gray-900 dark:text-white max-w-[220px] truncate"
                title={data?.data.jobTitle}
              >
                {data?.data.jobTitle}
              </span>
            </div>

          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setIsPreviewOpen(true)}
              className="h-10 px-4 rounded-xl border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-transparent font-bold text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer"
              type="button"
            >
              Preview
            </button>

            <button
              onClick={handleSaveChanges}
              className="h-10 px-5 rounded-xl bg-primary text-white font-extrabold text-sm hover:opacity-95 transition shadow-sm cursor-pointer"
              type="button"
            >
              Save Changes
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="max-w-[980px] mx-auto py-8 md:py-10 px-4 space-y-6">
        {/* Top hint */}
        <div className="rounded-2xl border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-[#1a1e2e] p-4">
          <p className="text-xl font-bold text-gray-900 dark:text-white">
            Manage screening questions
          </p>
          <p className="text-xs text-[#616889] mt-1">
            Add, edit or delete questions for this job. Use “Preview” to quickly
            see how it looks.
          </p>
        </div>

        {/* Empty state */}
        {questions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-[#1a1e2e] p-10 text-center">
            <p className="text-lg font-extrabold text-gray-900 dark:text-white">
              No questions yet
            </p>
            <p className="text-sm text-[#616889] mt-2">
              Create your first screening question to start filtering applicants.
            </p>

            <button
              onClick={() => setIsDrawerOpen(true)}
              className="mt-6 inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-primary text-white font-extrabold hover:opacity-95 transition cursor-pointer"
              type="button"
            >
              <AddIcon />
              Add New Question
            </button>
          </div>
        ) : (
          <>
            {/* List */}
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q._id}
                  className="group bg-white dark:bg-[#1a1e2e] border border-[#dbdde6] dark:border-gray-700 rounded-2xl p-5 hover:border-primary/70 dark:hover:border-primary/60 transition shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-[11px] font-extrabold bg-blue-50 border border-blue-400 text-primary px-2 py-1 rounded-full">
                          Q{index + 1}
                        </span>

                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                          {q.title}
                        </h3>

                        <span className="text-[11px] font-bold px-2 py-1 rounded-full border border-[#dbdde6] dark:border-gray-700 text-[#616889] dark:text-gray-300">
                          {q.inputType}
                        </span>

                        <span
                          className={
                            q.isRequired
                              ? "text-[11px] font-bold px-2 py-1 rounded-full bg-red-500/10 text-red-600"
                              : "text-[11px] font-bold px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300"
                          }
                        >
                          {q.isRequired ? "Required" : "Optional"}
                        </span>

                        {q.isKnockout && (
                          <span className="text-[11px] font-bold px-2 py-1 rounded-full bg-orange-500/10 text-orange-600">
                            Knockout
                          </span>
                        )}
                      </div>

                      {q.description && (
                        <p className="text-sm text-[#616889] mt-2 line-clamp-2">
                          {q.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingQuestion(q)
                          setIsEditDialogOpen(true)
                        }}
                        className="h-10 w-10 grid place-items-center rounded-xl border border-[#dbdde6] dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer"
                        aria-label="Edit"
                        type="button"
                      >
                        <EditIcon />
                      </button>

                      <ScreeningQuestionDeleteButton
                        jobId={jobId}
                        questionId={q._id}
                        questionTitle={q.title}
                        onDeleted={async () => {
                          toast.success("Question deleted")
                          await refetch()
                        }}

                      />

                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between text-xs text-[#616889]">
                    <span className="opacity-80">
                      Order:{" "}
                      <span className="font-bold">{q.order ?? index + 1}</span>
                    </span>

                    <span className="opacity-0 group-hover:opacity-100 transition">
                      Click edit to update question details
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Question CTA */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="w-full rounded-2xl border-2 border-dashed border-[#dbdde6] dark:border-gray-700 p-7 md:p-8 text-[#616889] hover:border-primary hover:text-primary hover:bg-primary/5 transition flex justify-center gap-2 items-center cursor-pointer"
              type="button"
            >
              <AddIcon />
              <span className="text-base md:text-lg font-extrabold">
                Add New Question
              </span>
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
          <DialogContent className="max-w-lg">
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
              className="mt-6 bg-primary text-white px-4 py-2 rounded-xl w-full font-bold hover:opacity-95 transition cursor-pointer"
              type="button"
            >
              Save Changes
            </button>
          </DialogContent>
        </Dialog>
      )}

      {/* PREVIEW */}
      {isPreviewOpen && (
        <Dialog open onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Preview</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              {questions.map((q, i) => (
                <div
                  key={q._id}
                  className="rounded-xl border border-[#dbdde6] dark:border-gray-700 bg-white dark:bg-[#1a1e2e] p-3"
                >
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    Q{i + 1}: {q.title}
                  </p>
                  <p className="text-xs text-[#616889] mt-1">
                    Type: {q.inputType} • {q.isRequired ? "Required" : "Optional"}
                  </p>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ScreeningQuestions
