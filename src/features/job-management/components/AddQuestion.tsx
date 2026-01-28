"use client"
import { useState } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
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
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<"radio" | "text" | "url">("radio")
  const [required, setRequired] = useState(true)
  const [isKnockout, setIsKnockout] = useState(false)
  const [options, setOptions] = useState<string[]>(["Option 1", "Option 2"])

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleAddOption = () => {
    setOptions([...options, `Option ${options.length + 1}`])
  }

  const handleDeleteOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index)
    setOptions(newOptions)
  }

  const handleSave = () => {
    if (!title.trim()) return

    const questionData = {
      title,
      description,
      type,
      required,
      options: type === "radio" ? options : undefined,
      isKnockout,
    }

    onAdd(questionData)

    // reset
    setTitle("")
    setDescription("")
    setType("radio")
    setRequired(true)
    setOptions(["Option 1", "Option 2"])
    setIsKnockout(false)

    onClose()
  }

  return (
    <div className="h-full w-full p-4">
      <div className="bg-white w-full h-full p-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Add Question</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        {/* Form */}
        <div className="space-y-3">
          <input
            placeholder="Question"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />

          {/* Input Type */}
          <div>
            <label className="text-sm font-medium">Input Type</label>
            <select
              value={type}
              onChange={(e) => {
                const selectedType = e.target.value as "radio" | "text" | "url"
                setType(selectedType)

                if (selectedType !== "radio") {
                  setOptions([])
                } else {
                  setOptions(["Option 1", "Option 2"])
                }
              }}
              className="w-full border p-2 rounded mt-1"
            >
              <option value="radio">Radio Button</option>
              <option value="text">Long Text</option>
              <option value="url">URL</option>
            </select>
          </div>


          {/* Options */}
          {type === "radio" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Options</label>

              {options.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    className="flex-1 border p-2 rounded"
                    value={opt}
                    onChange={(e) => handleOptionChange(i, e.target.value)}
                    placeholder={`Option ${i + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() => handleDeleteOption(i)}
                    className="px-3 py-2 text-red-600 rounded hover:bg-red-50"
                  >
                      <DeleteIcon fontSize="small" />
                  </button>
                </div>
              ))}

              <button
                className="text-blue-600 text-sm mt-2"
                onClick={handleAddOption}
                type="button"
              >
                + Add option
              </button>
            </div>
          )}

          {/* Required */}
          <div className="flex items-center space-x-2">
            <span>Required</span>
            <input
              type="checkbox"
              checked={required}
              onChange={() => setRequired(!required)}
            />
          </div>

          {/* Knockout */}
          <div className="flex items-center space-x-2">
            <span>Is knockout question</span>
            <input
              type="checkbox"
              checked={isKnockout}
              onChange={() => setIsKnockout(!isKnockout)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            className="bg-white text-black border w-[40%] py-2 rounded"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="bg-blue-600 text-white flex-1 py-2 rounded"
            onClick={handleSave}
          >
            Create Question
          </button>
        </div>
      </div>
    </div>
  )
}
