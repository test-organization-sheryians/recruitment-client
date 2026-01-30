"use client"

import { useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"

interface AddQuestionProps {
  onClose: () => void
  onAdd: (question: {
    title: string
    description: string
    type: "radio" | "text" | "url"
    required: boolean
    options?: string[]
    isKnockout: boolean
  }) => void
}

export default function AddQuestion({ onClose, onAdd }: AddQuestionProps) {
  const [open, setOpen] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"radio" | "text" | "url">("radio")
  const [required, setRequired] = useState(true)
  const [isKnockout, setIsKnockout] = useState(false)
  const [options, setOptions] = useState<string[]>(["Option 1", "Option 2"])

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options]
    updated[index] = value
    setOptions(updated)
  }

  const handleAddOption = () => {
    setOptions([...options, `Option ${options.length + 1}`])
  }

  const handleDeleteOption = (index: number) => {
    setOptions(options.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!title.trim()) return

    onAdd({
      title,
      description,
      type,
      required,
      options: type === "radio" ? options : undefined,
      isKnockout,
    })

    setTitle("")
    setDescription("")
    setType("radio")
    setRequired(true)
    setOptions(["Option 1", "Option 2"])
    setIsKnockout(false)

    setOpen(false)
    onClose()
  }

  return (
    <>
      {/* Backdrop blur */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]" />

      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => {
          setOpen(false)
          onClose()
        }}
        PaperProps={{
          sx: { width: 600 },
        }}
      >
        <div className="flex flex-col h-full bg-white dark:bg-[#1a1e2e]">

          {/* Header */}
          <div className="p-6 border-b border-[#dbdde6] dark:border-gray-800 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Add New Question</h2>
              <p className="text-xs text-gray-500 mt-1">
                Configure screening logic and input details
              </p>
            </div>
            <button
              onClick={() => {
                setOpen(false)
                onClose()
              }}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* Question */}
            <div>
              <label className="block text-sm font-bold mb-2">Question Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. How many years of experience do you have?"
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Provide additional context for the candidate..."
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              />
            </div>

            {/* Input Type */}
            <div>
              <label className="block text-sm font-bold mb-2">Input Type</label>
              <select
                value={type}
                onChange={(e) => {
                  const val = e.target.value as "radio" | "text" | "url"
                  setType(val)
                  setOptions(val === "radio" ? ["Option 1", "Option 2"] : [])
                }}
                className="w-full rounded-lg border border-gray-300 p-2 text-sm"
              >
                <option value="radio">Radio Buttons</option>
                <option value="text">Long Text</option>
                <option value="url">URL</option>
              </select>
            </div>

            {/* Options */}
            {type === "radio" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold">Options</label>
                  <button
                    type="button"
                    onClick={handleAddOption}
                    className="text-xs font-bold text-blue-600"
                  >
                    + Add Option
                  </button>
                </div>

                {options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 p-2 text-sm"
                    />
                    <button
                      onClick={() => handleDeleteOption(i)}
                      className="text-red-500"
                    >
                      <DeleteIcon fontSize="small" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Required */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div>
                <p className="text-sm font-bold">Is Required</p>
                <p className="text-xs text-gray-500">
                  Candidate must answer to submit
                </p>
              </div>
              <input
                type="checkbox"
                checked={required}
                onChange={() => setRequired(!required)}
              />
            </div>

            {/* Knockout */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">Is Knockout Question</p>
                <p className="text-xs text-gray-500">
                  Filter candidates based on answer
                </p>
              </div>
              <input
                type="checkbox"
                checked={isKnockout}
                onChange={() => setIsKnockout(!isKnockout)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#dbdde6] dark:border-gray-800 flex gap-3">
            <button
              className="flex-1 h-11 rounded-lg border font-bold"
              onClick={() => {
                setOpen(false)
                onClose()
              }}
            >
              Cancel
            </button>
            <button
              className="flex-[2] h-11 rounded-lg bg-blue-600 text-white font-bold"
              onClick={handleSave}
            >
              Create Question
            </button>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  )
}
