"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import AddQuestion from "./AddQuestion"  // adjust path if needed
import AddIcon from "@mui/icons-material/Add"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
// import JobDeleteButton from "../ui/JobDeleteButton"
import toast from "react-hot-toast"
import ConfirmDeleteDialog from "../ui/ConfirmDeleteDialog"


export type QuestionType = "radio" | "text" | "url"

export interface ScreeningQuestion {
  id: number
  title: string
  type: QuestionType
  required: boolean
}

const ScreeningQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([])
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [type, setType] = useState<QuestionType>("radio")
  const [required, setRequired] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // ================= Load saved questions on mount =================
  useEffect(() => {
    const saved = localStorage.getItem("screening_questions")
    if (saved) setQuestions(JSON.parse(saved))
    else {
      // default questions if none saved
      setQuestions([
        { id: 1, title: "How many years of experience do you have with Figma?", type: "radio", required: true },
        { id: 2, title: "Please describe your most challenging design project.", type: "text", required: false },
        { id: 3, title: "Portfolio Link", type: "url", required: true },
      ])
    }
  }, [])

  // ================= FUNCTIONS =================
  const deleteQuestion = (id: number) => {
    setQuestions(prev => prev.filter(q => q.id !== id))
    toast.success("Question deleted")
  }

  const handleSaveChanges = () => {
    localStorage.setItem("screening_questions", JSON.stringify(questions))
    toast.success("Questions saved successfully")
  }

  const handleEditQuestion = (q: ScreeningQuestion) => {
    setEditingQuestionId(q.id)
    setTitle(q.title)
    setType(q.type)
    setRequired(q.required)
    setIsEditDialogOpen(true)

  }

  const handleSaveEdit = () => {
    if (editingQuestionId) {
      setQuestions(prev =>
        prev.map(q =>
          q.id === editingQuestionId ? { ...q, title, type, required } : q
        )
      )
      setIsEditDialogOpen(false)
      toast.success("Question updated")
    }
  }

  const handleAddQuestion = (q: { title: string; type: QuestionType; required: boolean }) => {
    setQuestions(prev => [
      ...prev,
      { id: Date.now(), title: q.title, type: q.type, required: q.required },
    ])
    setIsDrawerOpen(false)
    toast.success("Question added")
  }

  // ================= UI =================
  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors">
      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white dark:bg-[#111218] border-b border-[#dbdde6] dark:border-gray-800 px-10 py-3 flex justify-between">
        <div className="flex items-center gap-6">
          <h2 className="text-lg font-bold">AdminPanel</h2>
          <nav className="flex items-center gap-2 text-sm text-[#616889]">
            <span>Jobs</span> /
            <span>Senior Product Designer</span> /
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

      {/* ================= CONTENT ================= */}
      <main className="max-w-[900px] mx-auto py-10 px-4 space-y-6">

        {/* TITLE */}
        <div>
          <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
            Hiring workflow
          </span>

          <h1 className="text-3xl font-black mt-2">
            Screening Questions for Senior Product Designer
          </h1>

          <p className="text-[#616889] mt-1">
            Define and order the questions candidates must answer during their application.
          </p>
        </div>

        {/* ================= QUESTIONS LIST ================= */}
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.id}
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
                    <span>
                      {q.type === "radio"
                        ? "Radio Select"
                        : q.type === "text"
                          ? "Long Text"
                          : "URL/Text"}
                    </span>

                    <span className={q.required ? "text-red-500" : ""}>
                      {q.required ? "Required" : "Optional"}
                    </span>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditQuestion(q)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <EditIcon />
                  </button>

                  <button
                    onClick={() => deleteQuestion(q.id)}
                    className="p-2 rounded-lg text-red-500 hover:text-red-600"
                  >
                    <DeleteIcon />
                  </button>
                  {/* <ConfirmDeleteDialog
                    title="Delete this question?"
                    consequences={[
                      'This screening question will be permanently removed',
                    ]}
                    onDelete={async () => {
                      deleteQuestion(q.id);
                      return true;
                    }}
                    trigger={
                      <button className="p-2 text-red-500 hover:text-red-600">
                        <DeleteIcon />
                      </button>
                    }
                  /> */}


                </div>
              </div>

              <p className="text-sm text-[#616889] mt-3">
                Question {index + 1} details can go here. You can add description or instructions for candidates.
              </p>
            </div>
          ))}
        </div>

        {/* ================= ADD BUTTON ================= */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="w-full border-2 border-dashed border-[#dbdde6] rounded-xl p-8 text-[#616889] hover:border-primary hover:text-primary hover:bg-primary/5 flex justify-center gap-2 items-center"
        >
          <AddIcon />
          <span className="text-lg font-bold">Add New Question</span>
        </button>

      </main>

      {/* ================= ADD QUESTION DRAWER ================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-[500px] bg-white shadow-2xl">
            <AddQuestion
              onClose={() => setIsDrawerOpen(false)}
              onAdd={handleAddQuestion}
            />
          </div>
        </div>
      )}

      {/* ================= EDIT QUESTION DIALOG ================= */}
      {isEditDialogOpen && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Question</DialogTitle>
            </DialogHeader>

            <div className="mt-4 space-y-4">
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Question Title"
                className="w-full border rounded p-2"
              />

              <select
                value={type}
                onChange={e => setType(e.target.value as QuestionType)}
                className="w-full border rounded p-2"
              >
                <option value="radio">Radio</option>
                <option value="text">Text</option>
                <option value="url">URL</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={required}
                  onChange={e => setRequired(e.target.checked)}
                />
                Required
              </label>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditDialogOpen(false)}
                  className="px-4 py-2 bg-gray-200 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-primary text-white rounded"
                >
                  Save
                </button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* ================= PREVIEW DIALOG ================= */}
      {isPreviewOpen && (
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Preview Questions</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {questions.map((q, index) => (
                <div key={q.id} className="p-2 border rounded">
                  <p>
                    <strong>Q{index + 1}:</strong> {q.title}{" "}
                    {q.required && <span className="text-red-500">(Required)</span>}
                  </p>
                  <p className="text-sm text-gray-500">
                    Type: {q.type === "radio" ? "Radio Select" : q.type === "text" ? "Long Text" : "URL/Text"}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Close
              </button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default ScreeningQuestions