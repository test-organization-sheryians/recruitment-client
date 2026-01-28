"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import AddQuestion from "./AddQuestion"  // path adjust if needed
import SwipeableDrawer from "@/features/job-management/ui/SwipeableDrawer"
import AddIcon from "@mui/icons-material/Add"

import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

// ================= TYPEimport AddQuestionModal from "./AddQuestionModal"  // path adjust if needed

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
  
const [isPreviewOpen, setIsPreviewOpen] = useState(false)
const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  const [newQuestion, setNewQuestion] = useState<{
  title: string
  description: string
  type: QuestionType
  options: string[]
  required: boolean
}>({
  title: "",
  description: "",
  type: "radio",
  options: [""],
  required: false,
})


  // ================= FUNCTIONS =================
  const deleteQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
  }

  const updateQuestion = (id: number, newTitle: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, title: newTitle } : q))
    )
  }
  const handleSaveChanges = () => {
  localStorage.setItem("screening_questions", JSON.stringify(questions))
  
}

  /*const handleAddQuestion = () => {
  const id = Date.now()
  const questionToAdd: ScreeningQuestion = {
    id,
    title: newQuestion.title,
    type: newQuestion.type,
    required: newQuestion.required,
  }*/
  /*setQuestions((prev) => [...prev, questionToAdd])
 
  setNewQuestion({
    title: "",
    description: "",
    type: "radio",
    options: [""],
    required: false,
  })
}*/





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

        </div>
  <div className="flex items-center justify-between gap-5">
    <button
  onClick={() => setIsPreviewOpen(true)}
  className="flex items-center  px-6 py-3 bg-white text-gray-500 font-semibold rounded-xl shadow-md hover:scale-105 transition"
>
  Preview
</button>
<button
  onClick={handleSaveChanges}
  className="flex items-center  px-3 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow-md hover:bg-blue-700 transition hover:scale-105"
>
  Save Changes
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
              {/* ================= PREVIEW MODAL ================= */}
{/* ================= PREVIEW MODAL ================= */}
{/* ================= PREVIEW MODAL ================= */}
<Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle>Application Preview</DialogTitle>
    </DialogHeader>

    <div className="space-y-4 mt-4">
      {questions.length === 0 ? (
        <p className="text-gray-500">No questions added yet.</p>
      ) : (
        questions.map((q, i) => (
          <div key={q.id} className="border p-4 rounded-lg">
            <p className="font-semibold">
              {i + 1}. {q.title}
              {q.required && <span className="text-red-500"> *</span>}
            </p>

            {q.type === "radio" && (
              <div className="mt-2 space-y-1">
                <label className="flex items-center gap-2">
                  <input type="radio" name={`q${q.id}`} /> Option 1
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name={`q${q.id}`} /> Option 2
                </label>
              </div>
            )}

            {q.type === "text" && (
              <textarea
                className="w-full border rounded-lg mt-2 p-2 bg-gray-50"
                placeholder="Your answer..."
              />
            )}

            {q.type === "url" && (
              <input
                type="url"
                className="w-full border rounded-lg mt-2 p-2 bg-gray-50"
                placeholder="https://example.com"
              />
            )}
          </div>
        ))
      )}
    </div>

    <div className="mt-6 flex justify-end">
      <button
        onClick={() => setIsPreviewOpen(false)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Submit
      </button>
    </div>
  </DialogContent>
</Dialog>




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
         <div className="px-10 flex justify-center items-center">
  <button
  onClick={() => setIsDrawerOpen(true)}
  className="mt-10 px-6 py-3 w-full bg-white text-gray-600 font-semibold rounded-xl shadow-md transition transform hover:scale-105 flex items-center justify-center gap-3"
>
  {/* circle icon */}
  <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gray-600 text-white">
    <AddIcon fontSize="small" />
  </span>

  <span>Add New Question</span>
</button>

</div>

        </div>
 {/* ================= ADD QUESTION SLIDE PAGE ================= */}
{isDrawerOpen && (
  <div className="fixed inset-0 z-50">
    
    {/* background overlay */}
    <div
      className="absolute inset-0 bg-black/40"
      onClick={() => setIsDrawerOpen(false)}
    />

    {/* slide page */}
    <div className="absolute right-0 top-0 h-full w-[420px] bg-white shadow-2xl animate-slideInRight
">
      <AddQuestion
        onClose={() => setIsDrawerOpen(false)}
        onAdd={(q) => {
          const newQuestion = {
            id: Date.now(),
            title: q.title,
            type: q.type,
            required: q.required,
          }
          setQuestions((prev) => [...prev, newQuestion])
          setIsDrawerOpen(false)
        }}
      />
    </div>
  </div>
)}


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