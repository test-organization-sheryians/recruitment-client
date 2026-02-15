"use client";

import React, { useState, useEffect } from "react";
import { useGetJobQuestions } from "../hooks/useGetJobQuestions";
import { applyJob } from "@/api";
import { useGetProfile } from "@/features/candidate/Profile/hooks/useProfileApi";
import { uploadFileToS3 } from "@/lib/uploadFile";
import type { CandidateProfile } from "@/types/profile";
import type { Job } from "@/types/Job";

/* ================= TYPES ================= */

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
    <h2 className="block text-[15px] font-semibold text-gray-900">
      <span>
        {title}
        {required && <span className="text-red-500 ml-1">*</span>}
      </span>
    </h2>
    <div className="mt-3 space-y-3">{children}</div>
  </div>
);

const OptionWrapper = ({ children }: { children: React.ReactNode }) => (
  <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer shadow-sm">
    {children}
  </label>
);

/* ================= COMPONENT ================= */

export default function JobQuestionsForm({
  jobId,

  onSuccess,
  onBack,
  userProfile,
  jobDetails,
}: Props) {
  console.log(userProfile);
  console.log(jobDetails);
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

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalScrollbarWidth = document.body.style.scrollbarWidth;

    document.body.style.overflow = "auto";
    document.body.style.scrollbarWidth = "none"; // Firefox

    document.body.classList.add("hide-body-scrollbar");

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.scrollbarWidth = originalScrollbarWidth;
      document.body.classList.remove("hide-body-scrollbar");
    };
  }, []);

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
    onSuccess?.();
  };

  if (isLoading) return null;
  if (isError) return <p className="text-red-500">Failed to load</p>;
  /* ================= UI ================= */

  return (
    <>
      {/* 🔝 HEADER – sabse upar */}
      <header className="bg-white border-b px-4 sm:px-6">
        <div className="h-14 max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold text-blue-600 text-sm sm:text-base">
            <span className="text-xl">▮</span>
            Job Application Portal
          </div>

          <div className="hidden sm:flex items-center gap-3 text-sm text-gray-600 ">
            <div className="text-right leading-tight">
              <p className="font-medium">
                {`${profile?.user?.firstName ?? ""} ${profile?.user?.lastName ?? ""}`}
              </p>
              <p className="text-xs">{`${profile?.user?.email ?? ""}`}</p>
            </div>
            {/* <div className="w-8 h-8 rounded-full bg-gray-300" /> */}
          </div>
        </div>
      </header>

      <div className="text-center space-y-1 mt-6">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
          {jobDetails?.title}
        </h1>
        <p className="text-sm text-gray-500">
          {typeof jobDetails.location === "object"
            ? `${jobDetails.location.city}, ${jobDetails.location.state}, ${jobDetails.location.country}`
            : jobDetails.location}
        </p>
      </div>

      {/* Auto-filled Profile Info */}
      <div className="px-4 py-8">
        <div className="max-w-3xl mx-auto  rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900">
              Personal Information
            </h2>

            <span className="rounded-md bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
              Auto-filled
            </span>
          </div>

          {/* Content */}
          <div className="divide-y divide-gray-200">
            {/* Row 1 */}
            <div className="grid grid-cols-2 px-6 py-4">
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="text-sm font-medium text-gray-900">{`${profile?.user?.firstName ?? ""} ${profile?.user?.lastName ?? ""}`}</p>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 px-6 py-4">
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="text-sm font-medium text-gray-900">
               {`${profile?.user?.email ?? ""}`}
              </p>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-2 px-6 py-4">
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="text-sm font-medium text-gray-900">
                {userProfile?.user?.phoneNumber || "Phone number not available"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className=" min-h-screen px-4 py-8 hide-scrollbar">
        <div className="max-w-3xl mx-auto space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-2xl  border flex flex-col overflow-hidden">
              {/* card header */}
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Screening Questions
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Please answer the following questions to help us understand
                  your background better.
                </p>
              </div>

              {/* Questions Body */}
              <div className="px-6 py-6 space-y-8">
                {questions.map((q, index) => (
                  <QuestionWrapper
                    key={q._id}
                    index={index}
                    title={q.title}
                    required={q.isRequired}
                  >
                    {/* inputs yahan aayenge */}
                    {/* text / textarea / radio / checkbox */}

                    {/* TEXT */}
                    {q.inputType === "text" && (
                      <input
                        className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
                        placeholder="Type your answer here"
                        onChange={(e) =>
                          handleChange(
                            q.title,
                            e.target.value.replace(/[^a-zA-Z\s]/g, ""),
                          )
                        }
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
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
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
                      <div className="space-y-3">
                        {(q.options ?? []).map((opt) => {
                          const value =
                            typeof opt === "string" ? opt : opt.label;

                          const selected =
                            answers.find((a) => a.question === q.title)
                              ?.answer === value;

                          return (
                            <label
                              key={value}
                              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition
          ${
            selected
              ? "border-blue-600 bg-blue-50"
              : "border-gray-200 hover:border-blue-400 hover:bg-blue-50"
          }`}
                            >
                              {/* circular radio */}
                              <input
                                type="radio"
                                name={q._id}
                                checked={selected}
                                onChange={() => handleChange(q.title, value)}
                                className="h-4 w-4 accent-blue-600"
                              />

                              <span className="text-sm font-normal text-slate-600">
                                {value}
                              </span>
                            </label>
                          );
                        })}
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
                            <span className="text-sm font-normal text-slate-600">
                              {opt}
                            </span>
                          </OptionWrapper>
                        ))}
                      </div>
                    )}

                    {/* CHECKBOX */}
                    {q.inputType === "checkbox" && (
                      <div className="space-y-3">
                        {getOptions(q).map((opt) => (
                          <label
                            key={opt}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 cursor-pointer
        hover:border-blue-400 hover:bg-blue-50 transition"
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 accent-blue-600"
                              onChange={() =>
                                handleCheckboxChange(q.title, opt)
                              }
                            />
                            <span className="text-sm font-normal text-slate-600">
                              {opt}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* ⭐ STAR RATING */}
                    {q.inputType === "rating" && (
                      <div className="space-y-2">
                        <div className="flex gap-2 bg-gray-50 p-3 rounded-xl w-fit">
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
                    {q.inputType === "file" && (
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 rounded-xl border border-blue-600 px-5 py-2.5 text-blue-600 hover:bg-blue-50 transition cursor-pointer font-medium">
                          📄 Upload PDF Resume
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
                ))}
              </div>

              <div className="border-t bg-white px-8 py-4">
                {error && (
                  <p className=" mt-2 mb-4  text-red-600 text-center">
                    {error}
                  </p>
                )}

                <div className="flex items-center justify-between gap-6">
                  {/* ⬅ Back */}
                  <button
                    type="button"
                    onClick={onBack}
                    className="flex items-center gap-2 text-base font-semibold text-gray-700 hover:text-black"
                  >
                    ← Back
                  </button>

                  {/* Continue */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="
    inline-flex items-center justify-center
    px-6 py-2.5
    rounded-lg
    bg-blue-600 hover:bg-blue-700
    text-sm font-semibold uppercase tracking-wide text-white
    shadow-sm hover:shadow-md
    transition-all
    disabled:opacity-60 disabled:cursor-not-allowed
  "
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