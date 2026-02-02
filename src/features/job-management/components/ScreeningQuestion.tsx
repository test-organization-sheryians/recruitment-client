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
import DeleteIcon from "@mui/icons-material/Delete"
import toast from "react-hot-toast"
import { useParams } from "next/navigation"

import {
  useGetJobApplicationQuestions,
  useCreateJobApplicationQuestions,
  useUpdateJobApplicationQuestion,
  useDeleteJobApplicationQuestion,
} from "../hooks/useJobApplicationQuestions"

/* ================= TYPES ================= */

export type QuestionType = "radio" | "text" | "url"

export interface ScreeningQuestion {
  _id: string
  title: string
  description?: string
  inputType: QuestionType
  options?: string[]
  isRequired: boolean
  isKnockout: boolean
  order?: number
}

/* ================= COMPONENT ================= */

const ScreeningQuestions: React.FC = () => {
  /* ---------- JOB ID ---------- */
  const params = useParams()
  const jobId =
    typeof params?.jobId === "string" ? params.jobId : undefined

  if (!jobId) return <div className="p-10">Job ID not found</div>

  /* ---------- STATE ---------- */
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([])
  const [editingQuestion, setEditingQuestion] =
    useState<ScreeningQuestion | null>(null)

    const handleSaveChanges = async () => {
  await refetch()
  toast.success("All changes saved successfully")
}


  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  /* ---------- API HOOKS ---------- */
  const { data, isLoading, refetch } =
    useGetJobApplicationQuestions(jobId)

  const createMutation = useCreateJobApplicationQuestions()
  const updateMutation = useUpdateJobApplicationQuestion()
  const deleteMutation = useDeleteJobApplicationQuestion()

  /* ---------- LOAD QUESTIONS ---------- */
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

  /* ================= ACTIONS ================= */

  const handleAddQuestion = (q: any) => {
    createMutation.mutate(
      {
        jobId,
        questions: [
          {
            title: q.title,
            description: q.description,
            inputType: q.type,
            options: q.options || [],
            isRequired: q.required,
            isKnockout: q.isKnockout,
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
        options: editingQuestion.options || [],

        isRequired: editingQuestion.isRequired,
        isKnockout: editingQuestion.isKnockout || false,
        order: editingQuestion.order,
      },
    },
    {
      onSuccess: async () => {
        toast.success("Question updated")
        setIsEditDialogOpen(false)
        await refetch()
      },
      onError: (err: any) => {
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

  /* ================= UI (NO CHANGE) ================= */

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors">

      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#111218] border-b border-[#dbdde6] dark:border-gray-800 px-10 py-3 flex justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-bold">AdminPanel</h2>
          <nav className="flex items-center gap-2 text-sm text-[#616889]">
            <span>Jobs</span> /
            <span className="font-bold text-black dark:text-white">
              Screening Questions
            </span>
          </nav>
        </div>

       <div className="flex gap-3">
  <button
    onClick={() => setIsPreviewOpen(true)}
    className="h-10 px-4 rounded-lg border font-bold hover:bg-gray-50"
  >
    Preview
  </button>

  <button
    onClick={handleSaveChanges}
    className="h-10 px-5 rounded-lg bg-primary text-white font-bold"
  >
    Save Changes
  </button>
</div>

      </header>

      {/* CONTENT */}
      <main className="max-w-[900px] mx-auto py-10 px-4 space-y-6">
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q._id}
              className="bg-white dark:bg-[#1a1e2e] border border-[#dbdde6] dark:border-gray-700 rounded-xl p-4 hover:border-primary transition"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded">
                      Q{index + 1}
                    </span>
                    <h3 className="font-semibold">{q.title}</h3>
                  </div>

                  <div className="flex gap-4 text-xs mt-2 text-[#616889]">
                    <span>{q.inputType}</span>
                    <span className={q.isRequired ? "text-red-500" : ""}>
                      {q.isRequired ? "Required" : "Optional"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingQuestion(q)
                      setIsEditDialogOpen(true)
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <EditIcon />
                  </button>

                  <button
                    onClick={() => deleteQuestion(q._id)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-600"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full border-2 border-dashed border-[#dbdde6] rounded-xl p-8 text-[#616889] hover:border-primary hover:text-primary hover:bg-primary/5 flex justify-center gap-2 items-center"
        >
          <AddIcon />
          <span className="text-lg font-bold">Add New Question</span>
        </button>
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
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>

            <input
              value={editingQuestion.title}
              onChange={(e) =>
                setEditingQuestion({
                  ...editingQuestion,
                  title: e.target.value,
                })
              }
              className="w-full border rounded p-2"
            />

            <button
              onClick={handleSaveEdit}
              className="mt-4 bg-primary text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </DialogContent>
        </Dialog>
      )}

      {/* PREVIEW */}
      {isPreviewOpen && (
        <Dialog open onOpenChange={setIsPreviewOpen}>
          <DialogContent>
            {questions.map((q, i) => (
              <p key={q._id}>
                Q{i + 1}: {q.title}
              </p>
            ))}
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ScreeningQuestions
