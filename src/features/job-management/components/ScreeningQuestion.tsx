"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import SwipeableDrawer from "@/features/job-management/ui/SwipeableDrawer"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

// ================= TYPES =================
export type QuestionType = "radio" | "text" | "url"

export interface ScreeningQuestion {
  id: number
  title: string
  type: QuestionType
  required: boolean
}

// ================= COMPONENT =================
const ScreeningQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([
    {
      id: 1,
      title: "How many years of experience do you have with Figma?",
      type: "radio",
      required: true,
    },
    {
      id: 2,
      title: "Please describe your most challenging design project.",
      type: "text",
      required: false,
    },
    {
      id: 3,
      title: "Portfolio Link",
      type: "url",
      required: true,
    },
  ])

  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // ================= FUNCTIONS =================
  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: number, newTitle: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, title: newTitle } : q))
    )
  }

  // ================= UI =================
  return (
    <div className="bg-[#f7f8fb] min-h-screen px-6 py-10">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex justify-between items-end gap-4 p-4">
          <div className="flex flex-col gap-1">
            <p className="text-[#111218] text-4xl font-black leading-tight tracking-[-0.033em]">
              Screening Questions
            </p>
            <p className="text-[#616889] text-base font-normal leading-normal">
              Define the questions candidates must answer during their application.
            </p>
          </div>

       <div className="flex justify-center mt-8">
  <button
    onClick={() => setIsDrawerOpen(true)}
    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition transform hover:scale-105"
  >
    + Add New Question
  </button>
</div>

        </div>

        {/* QUESTIONS LIST */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-xl border border-gray-200 transition-all"
            >
              <div className="w-full flex justify-between items-center px-6 py-5 text-left rounded-xl">
                <div>
                  <p className="text-lg font-bold text-gray-900">{q.title}</p>
                  <div className="flex gap-2 text-xs text-gray-500 mt-1">
                    <span>
                      {q.type === "radio"
                        ? "Radio Select"
                        : q.type === "text"
                        ? "Long Text"
                        : "URL Link"}
                    </span>
                    <span>•</span>
                    <span className={q.required ? "text-red-500" : ""}>
                      {q.required ? "Required" : "Optional"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingQuestionId(q.id)
                      setIsEditDialogOpen(true)
                    }}
                    className="p-2 text-blue-600 hover:bg-gray-100 rounded-lg transition"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="p-2 text-red-500 hover:bg-gray-100 rounded-lg transition"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>

              {/* DETAILS (optional) */}
              <div className="px-6 pb-6 pt-2 bg-gray-50 rounded-b-xl">
                <p className="text-sm text-gray-600">
                  Question {index + 1} details can go here. You can add description or instructions for candidates.
                </p>
              </div>

              {/* EDIT DIALOG */}
              <Dialog
                open={isEditDialogOpen && editingQuestionId === q.id}
                onOpenChange={(open) => {
                  if (!open) setIsEditDialogOpen(false)
                }}
              >
                <DialogContent className="w-full max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Edit Question</DialogTitle>
                  </DialogHeader>
                  <div className="flex flex-col gap-3 mt-4">
                    <input
                      type="text"
                      value={q.title}
                      onChange={(e) => updateQuestion(q.id, e.target.value)}
                      className="border rounded-lg p-2 w-full"
                    />
                    <button
                      onClick={() => setIsEditDialogOpen(false)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Save
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </div>
      </div>

      {/* ================= DRAWER ================= */}
      {/* <SwipeableDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onAdd={(q) => {
          const newQuestion = {
            id: Date.now(),
            title: q.title,
            type: q.type,
            required: q.required,
          }
          setQuestions((prev) => [...prev, newQuestion])
        }}
      /> */}
    </div>
  )
}

export default ScreeningQuestions
