"use client";

import React, { useState } from "react";
import { useGetJobQuestions } from "../hooks/useGetJobQuestions";
import { applyJob } from "@/api";
import { useGetProfile } from "@/features/candidate/Profile/hooks/useProfileApi";
import { uploadFileToS3 } from "@/lib/uploadFile";

/* ================= TYPES ================= */

type Props = {
  jobId: string;
  onSuccess: () => void;
};

type Answer = {
  question: string;
  answer: string;
};


type Question = {
  _id: string;
  title: string;
  inputType:
    | "text"
    | "textarea"
    | "dropdown"
    | "checkbox"
    | "radio"
    | "number"
    | "file"
    | "yes-no"
    | "date"
    | "rating";
 options?: (string | { label: string; value?: string })[];
  isRequired: boolean;
};

/* ================= UI HELPERS ================= */

const QuestionWrapper = ({
  index,
  title,
  required,
  children,
}: {
  index: number;
  title: string;
  required?: boolean;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h2 className="text-lg font-semibold text-gray-900 flex gap-3">
      <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-md text-sm">
        {index + 1}
      </span>
      <span>
        {title}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </h2>
    <div className="pl-11">{children}</div>
  </div>
);

const OptionWrapper = ({ children }: { children: React.ReactNode }) => (
  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-blue-50 cursor-pointer">
    {children}
  </label>
);

/* ================= COMPONENT ================= */

export default function JobQuestionsForm({ jobId, onSuccess }: Props) {
  const { data, isLoading, isError } = useGetJobQuestions(jobId);
  const { data: profile } = useGetProfile();

  const questions: Question[] = data || [];

  const [answers, setAnswers] = useState<Answer[]>([]);

  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [error, setError] = useState("");
  const [uploaded, setUploaded] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const getOptions = (q: Question): string[] =>
  q.options?.map((o) => (typeof o === "string" ? o : o.label)) || [];

  /* ================= HANDLERS ================= */

  const handleChange = async (
  questionText: string,
  value: string | number | File,
  inputType?: Question["inputType"],
) => {
    if (inputType === "file") {
      if (!(value instanceof File)) return;
      if (value.type !== "application/pdf") {
        setError("Only PDF files are allowed");
        return;
      }
      value = await uploadFileToS3(value);
      setUploaded((p) => ({ ...p, [questionText]: true }));
    }

    setAnswers((prev) => {
      const idx = prev.findIndex((a) => a.question === questionText);
      if (idx !== -1) {
        const updated = [...prev];
        updated[idx] = { question: questionText, answer: String(value) };
        return updated;
      }
      return [...prev, { question: questionText, answer: String(value) }];
    });
  };

  const handleCheckboxChange = (questionText: string, option: string) => {
    setAnswers((prev) => {
      const existing = prev.find((a) => a.question === questionText);
      const values = existing?.answer ? existing.answer.split(", ") : [];
      const updated = values.includes(option)
        ? values.filter((v) => v !== option)
        : [...values, option];
      const answer = updated.join(", ");
      return existing
        ? prev.map((a) =>
            a.question === questionText
              ? { question: questionText, answer }
              : a,
          )
        : [...prev, { question: questionText, answer }];
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    for (const q of questions) {
      const value = answers.find((a) => a.question === q.title)?.answer;
      if (q.isRequired && (!value || value.length === 0)) {
        setError(`${q.title} is required`);
        return;
      }
    }

    setSubmitting(true);
    await applyJob({
      jobId,
      resumeUrl: profile?.resumeFile,
      answers,
    });

    setSubmitting(false);
    onSuccess();
  };

  if (isLoading) return null;
  if (isError) return <p className="text-red-500">Failed to load</p>;

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-blue-50 px-4 py-10">
      <div className="max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="text-3xl font-bold text-center">
            Pre Application Questions
          </h1>

          <div className="bg-white rounded-xl p-6 space-y-8 shadow">
            {questions.map((q, index) => (
              <div key={q._id}>
                <QuestionWrapper
                  index={index}
                  title={q.title}
                  required={q.isRequired}
                >
                  {/* TEXT */}
                  {q.inputType === "text" && (
                    <input
                      className="w-full border px-4 py-2 rounded-lg"
                      onChange={(e) => handleChange(q.title, e.target.value)}
                    />
                  )}

                  {/* TEXTAREA */}
                  {q.inputType === "textarea" && (
                    <textarea
                      rows={4}
                      className="w-full border px-4 py-2 rounded-lg"
                      onChange={(e) => handleChange(q.title, e.target.value)}
                    />
                  )}

                  {/* NUMBER */}
                  {q.inputType === "number" && (
                    <input
                      type="number"
                      className="w-full border px-4 py-2 rounded-lg"
                      onChange={(e) => handleChange(q.title, e.target.value)}
                    />
                  )}

                  {/* DATE */}
                  {q.inputType === "date" && (
                    <input
                      type="date"
                      className="w-full border px-4 py-2 rounded-lg"
                      onChange={(e) => handleChange(q.title, e.target.value)}
                    />
                  )}

                  {/* DROPDOWN */}
                  {q.inputType === "dropdown" && (
                    <select
                      className="w-full border px-4 py-2 rounded-lg"
                      onChange={(e) => handleChange(q.title, e.target.value)}
                    >
                      <option value="">Select</option>
                      {getOptions(q).map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  )}

                  {/* RADIO */}
                  {q.inputType === "radio" && (
                    <div className="space-y-2">
                      {getOptions(q).map((opt) => (
                        <OptionWrapper key={opt}>
                          <input
                            type="radio"
                            name={q._id}
                            onChange={() => handleChange(q.title, opt)}
                          />
                          <span>{opt}</span>
                        </OptionWrapper>
                      ))}
                    </div>
                  )}

                  {/* YES / NO */}
                  {q.inputType === "yes-no" && (
                    <div className="space-y-2">
                      {["Yes", "No"].map((opt) => (
                        <OptionWrapper key={opt}>
                          <input
                            type="radio"
                            name={q._id}
                            onChange={() => handleChange(q.title, opt)}
                          />
                          <span>{opt}</span>
                        </OptionWrapper>
                      ))}
                    </div>
                  )}

                  {/* CHECKBOX */}
                  {q.inputType === "checkbox" && (
                    <div className="space-y-2">
                      {getOptions(q).map((opt) => (
                        <OptionWrapper key={opt}>
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(q.title, opt)}
                          />
                          <span>{opt}</span>
                        </OptionWrapper>
                      ))}
                    </div>
                  )}

                  {/* ⭐ STAR RATING */}
                  {q.inputType === "rating" && (
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => {
                              setRatings((p) => ({
                                ...p,
                                [q.title]: star,
                              }));
                              handleChange(q.title, star);
                            }}
                            className="text-3xl"
                          >
                            <span
                              className={
                                (ratings[q.title] ?? 0) >= star
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }
                            >
                              ★
                            </span>
                          </button>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 font-medium">
                        Rating
                        {ratings[q.title] && (
                          <span className="ml-2 text-blue-600">
                            ({ratings[q.title]} / 5)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* FILE */}
                  {/* FILE */}
                  {q.inputType === "file" && (
                    <div className="flex items-center gap-4">
                      <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer">
                        Upload PDF
                        <input
  type="file"
  hidden
  accept="application/pdf"
  onChange={(e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleChange(q.title, file, "file");
  }}
/>

                      </label>

                      {/* 🔥 YAHI UPLOADED MESSAGE AAYEGA */}
                      {uploaded[q.title] && (
                        <span className="text-green-600 font-medium">
                          Uploaded ✅
                        </span>
                      )}
                    </div>
                  )}
                </QuestionWrapper>

                {index !== questions.length - 1 && (
                  <div className="border-t mt-8" />
                )}
              </div>
            ))}
          </div>

          {error && <p className="text-red-600 text-center">{error}</p>}

          <div className="text-center">
            <button
              type="submit"
              disabled={submitting}
              className="px-10 py-3 rounded-xl bg-blue-600 text-white font-semibold"
            >
              {submitting ? "Applying..." : "Continue & Apply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
