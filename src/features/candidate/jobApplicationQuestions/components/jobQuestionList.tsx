
"use client";

import React, { useState, useEffect } from "react";
import { useGetJobQuestions } from "../hooks/useGetJobQuestions";
import { applyJob } from "@/api";
import { useGetProfile } from "@/features/candidate/Profile/hooks/useProfileApi";
import { uploadFileToS3 } from "@/lib/uploadFile";
import type { CandidateProfile } from "@/types/profile";
import type { Job } from "@/types/Job";
import { useToast } from "@/components/ui/Toast";
type Props = {
  jobId: string;
  onSuccess?: () => void;
  onBack: () => void;
  userProfile?: CandidateProfile;
  jobDetails: Job;
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
  <div className="space-y-3 sm:space-y-4">
    <h2 className="block text-sm sm:text-[15px] font-semibold text-gray-900">
      {title}
      {required && <span className="text-red-500 ml-1">*</span>}
    </h2>
    <div className="mt-2 sm:mt-3 space-y-3">{children}</div>
  </div>
);

const OptionWrapper = ({ children }: { children: React.ReactNode }) => (
  <label className="flex items-center gap-3 p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer shadow-sm">
    {children}
  </label>
);

export default function JobQuestionsForm({
  jobId,
  onSuccess,
  onBack,
  userProfile,
  jobDetails,
}: Props) {
  const toast = useToast();
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

  /* Prevent body scroll for mobile */
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const handleChange = async (
    questionText: string,
    value: string | number | File,
    inputType?: Question["inputType"]
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
          a.question === questionText ? { question: questionText, answer } : a
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
      toast.error(`${q.title} is required`);
      return;
    }
  }

  try {
    setSubmitting(true);

    await applyJob({
      jobId,
      resumeUrl: profile?.resumeFile,
      answers,
    });

    toast.success("Application submitted successfully!");

    onSuccess?.();
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to submit application ❌"
    );
  } finally {
    setSubmitting(false);
  }
};

  if (isLoading) return null;
  if (isError)
    return <p className="text-red-500 text-center mt-4">Failed to load</p>;

  return (
    <>
      {/* HEADER */}
      <header className="bg-white border-b px-4 sm:px-6">
        <div className="h-14 max-w-full sm:max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-blue-600 text-sm sm:text-base">
            <span className="text-xl">▮</span> Job Application Portal
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-600">
            <div className="text-right leading-tight">
              <p className="font-medium text-xs sm:text-sm">
                {`${profile?.user?.firstName ?? ""} ${profile?.user?.lastName ?? ""}`}
              </p>
              <p className="text-xs sm:text-sm">
                {`${profile?.user?.email ?? ""}`}
              </p>
            </div>
          </div>
        </div>
      </header>


      {/* JOB TITLE */}
      <div className="text-center space-y-1 mt-6 px-4 sm:px-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          {jobDetails?.title}
        </h1>
        <p className="text-sm text-gray-500">
          {typeof jobDetails.location === "object"
            ? `${jobDetails.location.city}, ${jobDetails.location.state}, ${jobDetails.location.country}`
            : jobDetails.location}
        </p>
      </div>

      {/* AUTO-FILLED PROFILE */}
      <div className="px-4 py-6 sm:py-8">
        <div className="max-w-full sm:max-w-3xl mx-auto rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-6 py-4 border-b border-gray-200 gap-2 sm:gap-0">
            <h2 className="text-sm font-semibold text-gray-900">
              Personal Information
            </h2>
            <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Auto-filled
            </span>
          </div>

          <div className="divide-y divide-gray-200">
            {[
              ["Full Name", `${profile?.user?.firstName ?? ""} ${profile?.user?.lastName ?? ""}`],
              ["Email Address", profile?.user?.email ?? ""],
              ["Phone Number", userProfile?.user?.phoneNumber || "Not available"],
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-1 sm:grid-cols-2 px-6 py-3 sm:py-4 gap-y-1">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QUESTIONS FORM */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-full sm:max-w-3xl mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl border flex flex-col overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Screening Questions
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Please answer the following questions to help us understand
                  your background better.
                </p>
              </div>

              <div className="px-4 sm:px-6 py-6 space-y-6">
                {questions.map((q, index) => (
                  <QuestionWrapper
                    key={q._id}
                    index={index}
                    title={q.title}
                    required={q.isRequired}
                  >
                    {/* INPUTS */}
                    {q.inputType === "text" && (
                      <input
                        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 transition"
                        placeholder="Type your answer here"
                        onChange={(e) =>
                          handleChange(q.title, e.target.value.replace(/[^a-zA-Z\s]/g, ""))
                        }
                      />
                    )}
                    {q.inputType === "textarea" && (
                      <textarea
                        rows={4}
                        className="w-full border px-4 py-2 rounded-lg text-sm"
                        onChange={(e) => handleChange(q.title, e.target.value)}
                      />
                    )}
                    {q.inputType === "number" && (
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        className="w-full border px-4 py-2 rounded-lg text-sm"
                        onChange={(e) => handleChange(q.title, e.target.value)}
                      />
                    )}
                    {q.inputType === "date" && (
                      <input
                        type="date"
                        className="w-full border px-4 py-2 rounded-lg text-sm"
                        onChange={(e) => handleChange(q.title, e.target.value)}
                      />
                    )}
                    {q.inputType === "file" && (
                      <input
                        type="file"
                        className="w-full border px-4 py-2 rounded-lg text-sm file:mr-4 file:py-2 file:px-4 
               file:rounded-lg file:border-0 file:text-sm file:font-semibold 
               file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleChange(q.title, file);
                          }
                        }}

                      />
                    )}

                    {q.inputType === "dropdown" && (
                      <select
                        className="w-full border px-4 py-2 rounded-lg text-sm"
                        onChange={(e) => handleChange(q.title, e.target.value)}
                      >
                        <option value="">Select</option>
                        {getOptions(q).map((opt) => (
                          <option key={opt}>{opt}</option>
                        ))}
                      </select>
                    )}
                    {q.inputType === "yes-no" && (
                      <div className="flex items-center gap-6">
                        {["Yes", "No"].map((option) => (
                          <label key={option} className="flex items-center gap-2 text-sm cursor-pointer">
                            <input
                              type="radio"
                              name={q.title} // important for grouping
                              value={option}
                              className="accent-blue-600 w-4 h-4"
                              onChange={(e) => handleChange(q.title, e.target.value)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {q.inputType === "checkbox" && (
                      <div className="flex flex-col gap-3">
                        {getOptions(q).map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              value={option}
                              className="accent-blue-600 w-4 h-4"
                              onChange={() => handleCheckboxChange(q.title, option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>
                    )}


                  </QuestionWrapper>
                ))}
              </div>

              <div className="border-t bg-white px-4 sm:px-6 py-4">
                {error && (
                  <p className="text-red-600 text-center mb-4">{error}</p>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-base font-semibold text-gray-700 hover:text-black"
                  >
                    ← Back
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

