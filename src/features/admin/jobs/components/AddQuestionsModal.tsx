"use client";

import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, X, HelpCircle, CheckCircle2 } from "lucide-react";
import Select from "@/components/ui/select";
import { addJobQuestions, updateJobQuestion, deleteJobQuestion } from "@/api/jobs/addJobQuestions";
import type { JobQuestion } from "@/types/JobQuestion";
import { useToast } from "@/components/ui/Toast"; // ✅ TOAST IMPORT

type QuestionRow = JobQuestion;

export default function AddQuestionsModal({
  jobId,
  onClose,
  onSaved,
  initialQuestions,
}: {
  jobId: string;
  onClose: () => void;
  onSaved?: () => void;
  initialQuestions?: QuestionRow[];
}) {
  const toast = useToast(); // ✅ TOAST HOOK

  const [questions, setQuestions] = useState<QuestionRow[]>(
    initialQuestions?.length
      ? initialQuestions
      : [{ title: "", inputType: "text", options: [], isRequired: false }]
  );

  const [loading, setLoading] = useState(false);
  const [qErrors, setQErrors] = useState<Record<number, { title?: string; options?: string }>>({});
  const firstInputRef = useRef<HTMLInputElement | null>(null);
  const hasQErrors = Object.values(qErrors).some((r) => !!(r && (r.title || r.options)));

  /* 🔒 Lock background scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  /* ----------------- Helpers ----------------- */
  const updateRow = (i: number, patch: Partial<QuestionRow>) => {
    setQuestions((prev) =>
      prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q))
    );
    setQErrors((prev) => ({ ...prev, [i]: { ...(prev[i] || {}), title: "", options: "" } }));
  };

  const addRow = () => {
    setQuestions((prev) => [
      ...prev,
      { title: "", inputType: "text", options: [], isRequired: false },
    ]);
  };

  const removeRow = async (i: number) => {
    const id = questions[i]?._id;
    if (id) {
      try {
        await deleteJobQuestion(jobId, id);
        setQuestions((prev) => prev.filter((_, idx) => idx !== i));
        setQErrors({});
        toast.success("Question deleted successfully");
      } catch (error) {
        toast.error("Failed to delete question");
      }
    } else {
      // If no ID (new question), just remove from UI
      setQuestions((prev) => prev.filter((_, idx) => idx !== i));
      setQErrors({});
      toast.success("Question removed successfully");
    }
  };

  const addOption = (i: number) =>
    updateRow(i, { options: [...questions[i].options, ""] });

  const updateOption = (qi: number, oi: number, value: string) => {
    updateRow(qi, {
      options: questions[qi].options.map((opt, idx) =>
        idx === oi ? value : opt
      ),
    });
  };

  const removeOption = (qi: number, oi: number) => {
    updateRow(qi, {
      options: questions[qi].options.filter((_, idx) => idx !== oi),
    });
  };

  const saveAll = async () => {
    const allValid = questions.every((_, i) => validateQuestion(i));
    if (!allValid) {
      // ❌ VALIDATION ERROR TOAST
      toast.error("Please fix all errors before saving");
      return;
    }

    setLoading(true);
    try {
      const toCreate = questions.filter((q) => !q._id);
      const toUpdate = questions.filter((q) => q._id);

      // Add questions toast
      if (toCreate.length) {
        await addJobQuestions(jobId, toCreate);
        toast.success(`${toCreate.length} question(s) added successfully`);
      }

      // Update questions toast
      if (toUpdate.length) {
        await Promise.all(
          toUpdate.map((q) => updateJobQuestion(jobId, q._id!, q))
        );
        toast.success(`${toUpdate.length} question(s) updated successfully`);
      }

      onClose();
    } catch (error) {
      // ❌ ERROR TOAST
      toast.error("Failed to save questions. Please try again");
    } finally {
      setLoading(false);
    }
  };

  /* ----------------- Validation ----------------- */
  const optionTypes = new Set(["radio", "checkbox", "dropdown"]);

  const validateQuestion = (i: number) => {
    const q = questions[i];
    let ok = true;
    const rowErr: { title?: string; options?: string } = {};

    if (!q.title || q.title.trim().length === 0) {
      rowErr.title = "Please enter question text";
      ok = false;
    } else if (q.title.trim().length < 5) {
      rowErr.title = "Question title must be at least 5 characters";
      ok = false;
    }

    if (optionTypes.has(q.inputType)) {
      if (!Array.isArray(q.options) || q.options.length < 2) {
        rowErr.options = "Add at least two options";
        ok = false;
      } else if (q.options.some((o) => !o || o.trim().length === 0)) {
        rowErr.options = "All options must be non-empty";
        ok = false;
      }
    }

    setQErrors((prev) => ({ ...prev, [i]: rowErr }));
    return ok;
  };

  /* ----------------- UI ----------------- */
  return (
    <>
      {/* Light professional backdrop */}
      <div className="fixed inset-0 z-999 bg-gray-200/80 backdrop-blur-sm" />

      {/* Modal wrapper */}
      <div className="fixed inset-0 z-1000 flex items-center justify-center  px-6">
        <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl flex flex-col">

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b bg-white">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              Manage Application Questions
            </h2>
            <button onClick={onClose}>
              <X className="w-6 h-6 text-gray-400 hover:text-gray-700" />
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6 bg-gray-50">
            {questions.map((q, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4 group"
              >
                {/* Question title + Required */}
                <div className="flex items-center justify-between">
                  <div className="text-gray-600 text-sm font-medium mb-1">Question {idx + 1}</div>

                  <label className="flex items-center gap-2 text-sm text-gray-600">
                    <input
                      type="checkbox"
                      checked={q.isRequired}
                      onChange={(e) =>
                        updateRow(idx, { isRequired: e.target.checked })
                      }
                      className="h-4 w-4 accent-blue-600 rounded"
                    />
                    <span className="select-none">Required</span>
                  </label>
                </div>

                {/* Question + Type */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <input
                    ref={idx === 0 ? firstInputRef : undefined}
                    value={q.title}
                    onChange={(e) =>
                      updateRow(idx, { title: e.target.value })
                    }
                    onBlur={() => validateQuestion(idx)}
                    placeholder="Enter question text"
                    className="md:col-span-3 w-full text-sm sm:text-base bg-[#DFECFF] rounded-base px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 outline-none border border-gray-200 focus:border-blue-400 transition "
                  />

                  <Select
                    value={q.inputType}
                    onChange={(e) => {
                      const val = (e.target as HTMLSelectElement).value;
                      updateRow(idx, {
                        inputType: val,
                        options:
                          val === "radio" || val === "checkbox" || val === "dropdown"
                            ? ["", ""]
                            : [],
                      });
                    }}
                    className="w-full text-sm text-gray-600 sm:text-base bg-[#DFECFF] rounded-base px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 outline-none border border-gray-200 focus:border-blue-400 transition"
                    options={[
                      "text",
                      "textarea",
                      "radio",
                      "checkbox",
                      "dropdown",
                      "yes-no",
                      "file",
                      "date",
                      "number",
                      "rating",
                    ].map((type) => ({ value: type, label: type }))}
                  />
                </div>
                {qErrors[idx]?.title && (
                  <p className="mt-2 text-xs text-red-600">{qErrors[idx].title}</p>
                )}

                {/* (Remove button moved below options) */}

                {/* ✅ OPTIONS (THIS WAS MISSING BEFORE) */}
                {(q.inputType === "radio" ||
                  q.inputType === "checkbox" ||
                  q.inputType === "dropdown") && (
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex gap-2 items-center relative hover:[&>button]:opacity-100">
                          <input
                            value={opt}
                            onChange={(e) =>
                              updateOption(idx, oi, e.target.value)
                            }
                            placeholder={`Option ${oi + 1}`}
                            onBlur={() => validateQuestion(idx)}
                            className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <button
                            onClick={() => removeOption(idx, oi)}
                            className="opacity-0 transition-opacity duration-150 w-9 h-9 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 flex items-center justify-center"
                            aria-label={`Remove option ${oi + 1} for question ${idx + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      {qErrors[idx]?.options && (
                        <p className="mt-1 text-xs text-red-600">{qErrors[idx].options}</p>
                      )}
                      <button
                        onClick={() => addOption(idx)}
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        <Plus className="w-4 h-4" />
                        Add option
                      </button>
                      {/* Move question-level Remove button under options */}
                      <div className="flex justify-end items-center text-sm text-gray-600 mt-2">
                        <button
                          onClick={() => removeRow(idx)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-2 rounded text-red-500 hover:text-red-600 flex items-center gap-1"
                          aria-label={`Remove question ${idx + 1}`}
                          title="Delete question"
                        >
                          <Trash2 className="w-4 h-4" />
                          <span className="select-none">Remove</span>
                        </button>
                      </div>
                    </div>
                  )}
                {/* For question types without options, still show Remove at bottom */}
                {!(q.inputType === "radio" || q.inputType === "checkbox" || q.inputType === "dropdown") && (
                  <div className="flex justify-end items-center text-sm text-gray-600">
                    <button
                      onClick={() => removeRow(idx)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 p-2 rounded text-red-500 hover:text-red-600 flex items-center gap-1"
                      aria-label={`Remove question ${idx + 1}`}
                      title="Delete question"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="select-none">Remove</span>
                    </button>
                  </div>
                )}
              </div>
            ))}

            {/* Add Question */}
            <div className="flex justify-end">
              <button
                onClick={addRow}
                className="inline-flex items-center gap-2 px-5 py-3 text-gray-600 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Question
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center px-8 py-5 border-t bg-white">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-100 rounded-xl font-semibold text-gray-700"
            >
              Cancel
            </button>

            <button
              onClick={saveAll}
              disabled={loading || hasQErrors}
              className="flex items-center gap-2 px-8 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg disabled:opacity-50"
            >
              <CheckCircle2 className="w-5 h-5" />
              {loading ? "Saving..." : "Save Questions"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
