"use client"

import React from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import { InputType } from "@/types/inputTypes"
import Rating from "@mui/material/Rating"

/* ================= TYPES ================= */

export type EditableQuestion = {
  title: string
  description?: string
  inputType: InputType
  options?: string[]
  isRequired: boolean
  isKnockout: boolean
  ratingValue?: number

  // ✅ ADD THIS (fix)
  fileValue?: {
    name: string
    size: number
    type: string
  }
}

interface EditQuestionFormProps {
  question: EditableQuestion
  onChange: (updated: EditableQuestion) => void
}

/* Input types that support options */
const optionSupportedTypes: InputType[] = ["radio", "checkbox", "dropdown", "yes-no"]

/* Default options for option-based inputs */
const getDefaultOptions = (type: InputType): string[] => {
  if (type === "yes-no") return ["Yes", "No"]
  if (optionSupportedTypes.includes(type)) return ["Option 1", "Option 2"]
  return []
}

const EditQuestionForm: React.FC<EditQuestionFormProps> = ({ question, onChange }) => {
  const { title, description, inputType, options = [], ratingValue = 3, fileValue, isRequired } = question

  /* ---------- OPTION HANDLERS ---------- */
  const updateOption = (index: number, value: string) => {
    const updated = [...options]
    updated[index] = value
    onChange({ ...question, options: updated })
  }

  const addOption = () => {
    onChange({ ...question, options: [...options, `Option ${options.length + 1}`] })
  }

  const deleteOption = (index: number) => {
    onChange({ ...question, options: options.filter((_, i) => i !== index) })
  }

  /* ---------- INPUT TYPE CHANGE ---------- */
  const handleInputTypeChange = (val: InputType) => {
    onChange({
      ...question,
      inputType: val,
      options: getDefaultOptions(val),

      // ✅ rating only when rating type
      ratingValue: val === "rating" ? (question.ratingValue ?? 3) : undefined,

      // ✅ file preview only when file type
      fileValue: val === "file" ? (question.fileValue ?? undefined) : undefined,
    })
  }

  return (
    <div className="space-y-4">
      {/* QUESTION TITLE */}
      <div>
        <label className="text-sm font-bold">Question Title</label>
        <input
          value={title}
          onChange={(e) => onChange({ ...question, title: e.target.value })}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      {/* DESCRIPTION */}
      <div>
        <label className="text-sm font-bold">Description</label>
        <textarea
          value={description || ""}
          onChange={(e) => onChange({ ...question, description: e.target.value })}
          rows={2}
          className="w-full border rounded p-2 mt-1"
        />
      </div>

      {/* INPUT TYPE */}
      <div>
        <label className="text-sm font-bold">Input Type</label>
        <select
          value={inputType}
          onChange={(e) => handleInputTypeChange(e.target.value as InputType)}
          className="w-full rounded-lg border p-2 text-sm"
        >
          <option value="text">Text</option>
          <option value="textarea">Textarea</option>
          <option value="number">Number</option>
          <option value="file">File Upload</option>
          <option value="checkbox">Checkbox</option>
          <option value="dropdown">Dropdown</option>
          <option value="yes-no">Yes / No</option>
        </select>
      </div>
      {/* OPTIONS */}
      {optionSupportedTypes.includes(inputType) && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-bold">Options</label>

            {inputType !== "yes-no" && (
              <button
                type="button"
                onClick={addOption}
                className="text-xs font-bold text-blue-600"
              >
                + Add Option
              </button>
            )}
          </div>

          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input
                value={opt}
                onChange={(e) => updateOption(i, e.target.value)}
                className="flex-1 border rounded p-2"
              />

              {inputType !== "yes-no" && (
                <button type="button" onClick={() => deleteOption(i)}>
                  <DeleteIcon fontSize="small" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {/* REQUIRED FIELD */}
<div className="flex items-center justify-between border rounded p-3">
  <div>
    <p className="text-sm font-bold">Required</p>
    <p className="text-xs text-gray-500">
      Applicant must answer this question.
    </p>
  </div>

  <input
    type="checkbox"
    checked={isRequired}
    onChange={() =>
      onChange({
        ...question,
        isRequired: !isRequired,
      })
    }
    className="h-5 w-5 accent-primary"
  />
</div>

    </div>
  )
}

export default EditQuestionForm
