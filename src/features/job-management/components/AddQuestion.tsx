"use client"

import { useState, useRef, useEffect } from "react"
import DeleteIcon from "@mui/icons-material/Delete"
import SwipeableDrawer from "@mui/material/SwipeableDrawer"
import { InputType } from "@/types/inputTypes"

interface AddQuestionProps {
  onClose: () => void
  onAdd: (question: {
    title: string
    description?: string
    inputType: InputType
    isRequired: boolean
    options?: string[]
    isKnockout: boolean
  }) => void
}

export default function AddQuestion({ onClose, onAdd }: AddQuestionProps) {
  const [open, setOpen] = useState(true)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [inputType, setInputType] = useState<InputType>("text")
  const [isRequired, setIsRequired] = useState(true)
  const [isKnockout, setIsKnockout] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const [isMobile, setIsMobile] = useState(false)

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const optionTypes: InputType[] = ["radio", "checkbox", "dropdown", "yes-no"]

  const getDefaultOptions = (type: InputType): string[] => {
    if (type === "yes-no") return ["Yes", "No"]
    if (["radio", "checkbox", "dropdown"].includes(type)) return ["Option 1", "Option 2"]
    return []
  }

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
      title: title.trim(),
      description: description.trim() ? description.trim() : undefined,
      inputType,
      isRequired,
      options: optionTypes.includes(inputType) ? options : [],
      isKnockout,
    })

    setTitle("")
    setDescription("")
    setInputType("text")
    setIsRequired(true)
    setIsKnockout(false)
    setOptions([])

    setOpen(false)
    onClose()
  }

  const closeDrawer = () => {
    setOpen(false)
    onClose()
  }

  const inputBase =
    "w-full rounded-xl border border-gray-200 dark:border-[#2b2f45] bg-white dark:bg-[#14172a] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 " +
    "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition"

  const labelBase = "block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2"

  const cardBase =
    "rounded-2xl border border-gray-200 dark:border-[#2b2f45] bg-white dark:bg-[#14172a] p-4 shadow-sm"

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]" />

      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={closeDrawer}
        PaperProps={{
          sx: {
            width: isMobile ? "100%" : 720,
            borderTopLeftRadius: 18,
            borderBottomLeftRadius: 18,
            overflow: "hidden",
          },
        }}
      >
        <div className="flex flex-col h-full bg-white dark:bg-[#0f1220]">
          {/* HEADER */}
          <div className="sticky top-0 z-10 px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 dark:border-[#2b2f45] bg-white/90 dark:bg-[#0f1220]/90 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Add New Question
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Create a screening question for this job application.
                </p>
              </div>

              <button
                onClick={closeDrawer}
                className="h-9 w-9 grid place-items-center rounded-lg border border-gray-200 dark:border-[#2b2f45] hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer"
                aria-label="Close"
                type="button"
              >
                ✕
              </button>
            </div>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 space-y-5">
            {/* TITLE */}
            <div className={cardBase}>
              <label className={labelBase}>Question Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputBase}
                placeholder="e.g. Do you have 2+ years of experience?"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                Keep it short and clear.
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className={cardBase}>
              <label className={labelBase}>Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className={inputBase}
                placeholder="Add helpful context for the applicant..."
              />
            </div>

            {/* INPUT TYPE */}
            <div className={cardBase}>
              <label className={labelBase}>Input Type</label>
              <CustomSelect
                value={inputType}
                onChange={(val) => {
                  setInputType(val as InputType)
                  setOptions(getDefaultOptions(val as InputType))
                }}
                options={[
                  { value: "text", label: "Text" },
                  { value: "textarea", label: "Textarea" },
                  { value: "number", label: "Number" },
                  { value: "date", label: "Date" },
                  { value: "file", label: "File Upload" },
                  { value: "rating", label: "Rating" },
                  { value: "radio", label: "Radio" },
                  { value: "checkbox", label: "Checkbox" },
                  { value: "dropdown", label: "Dropdown" },
                  { value: "yes-no", label: "Yes / No" },
                ]}
              />

              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-[11px] px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold">
                  {inputType}
                </span>
                {optionTypes.includes(inputType) && (
                  <span className="text-[11px] px-2 py-1 rounded-full bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 font-semibold">
                    Requires options
                  </span>
                )}
              </div>
            </div>

            {/* OPTIONS */}
            {optionTypes.includes(inputType) && (
              <div className={cardBase}>
                <div className="flex items-center justify-between">
                  <label className={labelBase + " mb-0"}>Options</label>

                  {inputType !== "yes-no" && (
                    <button
                      onClick={handleAddOption}
                      className="text-xs font-bold text-primary hover:underline cursor-pointer"
                      type="button"
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2">
                  {options.map((opt, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-[#2b2f45] bg-white dark:bg-[#14172a] px-3 py-2"
                    >
                      <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-6">
                        {i + 1}.
                      </span>

                      <input
                        value={opt}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        className="flex-1 bg-transparent text-sm outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                        placeholder={`Option ${i + 1}`}
                      />

                      {inputType !== "yes-no" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteOption(i)}
                          className="h-8 w-8 grid place-items-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition"
                          aria-label="Delete option"
                        >
                          <DeleteIcon fontSize="small" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {inputType === "yes-no" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                    Yes/No options are fixed.
                  </p>
                )}
              </div>
            )}

            {/* SETTINGS */}
            <div className={cardBase}>
              <p className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                Settings
              </p>

              {/* REQUIRED */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Required
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Applicant must answer this question.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isRequired}
                  onChange={() => setIsRequired(!isRequired)}
                  className="h-5 w-5 accent-primary"
                />
              </div>

              <div className="h-px bg-gray-200 dark:bg-[#2b2f45] my-3" />

              {/* KNOCKOUT */}
              {/* <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    Knockout Question
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Auto-reject if the answer doesn’t match.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isKnockout}
                  onChange={() => setIsKnockout(!isKnockout)}
                  className="h-5 w-5 accent-primary"
                />
              </div> */}
            </div>
          </div>

          {/* FOOTER */}
          <div className="sticky bottom-0 z-10 px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-[#2b2f45] bg-white/90 dark:bg-[#0f1220]/90 backdrop-blur">
            <div className="flex gap-3">
              <button
                className="flex-1 rounded-xl border border-gray-200 dark:border-[#2b2f45] py-2.5 text-sm font-bold text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-white/5 transition cursor-pointer"
                onClick={closeDrawer}
                type="button"
              >
                Cancel
              </button>

              <button
                className="flex-[2] rounded-xl py-2.5 text-sm font-bold text-white bg-primary hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSave}
                disabled={!title.trim()}
                type="button"
              >
                Create Question
              </button>
            </div>
          </div>
        </div>
      </SwipeableDrawer>
    </>
  )
}

/* ================= CUSTOM SELECT COMPONENT ================= */
function CustomSelect({
  value,
  onChange,
  options,
}: {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }

    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const selected = options.find((o) => o.value === value)

  return (
    <div className="w-full" ref={ref}>
      <div className="relative">
        <button
          type="button"
          onClick={() => setOpen((s) => !s)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="w-full flex items-center justify-between rounded-xl border border-gray-200 dark:border-[#2b2f45] bg-white dark:bg-[#14172a] px-3 py-2 text-sm text-gray-900 dark:text-gray-100 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition"
        >
          <span className={`${selected ? "" : "text-gray-400"}`}>
            {selected ? selected.label : "Select"}
          </span>

          <svg
            className={`w-4 h-4 ml-2 transform transition flex-shrink-0 ${
              open ? "rotate-180" : "rotate-0"
            }`}
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 8l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {open && (
          <ul
            role="listbox"
            tabIndex={-1}
            className="absolute z-40 mt-2 w-full bg-white dark:bg-[#14172a] rounded-xl border border-gray-200 dark:border-[#2b2f45] shadow-lg max-h-56 overflow-y-auto"
          >
            <li>
              <button
                type="button"
                onClick={() => {
                  onChange("")
                  setOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm transition ${
                  !value
                    ? "font-semibold bg-primary/10 text-primary"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                }`}
              >
                Select
              </button>
            </li>
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 text-sm transition ${
                    value === option.value
                      ? "bg-primary text-white font-semibold"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5"
                  }`}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
