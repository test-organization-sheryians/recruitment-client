"use client";
import React from "react";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ResultPage() {
  const router = useRouter();


  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const { data: result, isLoading } = useQuery({
    queryKey: ["resumeResult"],
    queryFn: () => {
      if (typeof window === "undefined") return null;

      const raw = sessionStorage.getItem("resumeResult");
      if (!raw) return null;

      return JSON.parse(raw);
    },
    staleTime: Infinity,
  });


  if (!isLoading && !result) {
    router.push("/candidate/ai-test");
    return null;
  }

  if (isLoading || !result) {
    return <p className="text-center p-8">Loading result…</p>;
  }

  const totalQuestions = result.questions.length;
  const score = result.score ?? 0;
  const displayScore = `${score} / ${totalQuestions}`;

  return (
    <div className="max-w-4xl mx-auto py-10 px-5">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          Your Results & Feedback
        </h2>

        <div className="flex justify-center mb-4">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center shadow-lg border">
            <p className="text-4xl font-bold text-blue-600">{displayScore}</p>
            <p className="text-gray-500 font-medium">Score</p>
          </div>
        </div>

        <p className="text-gray-700 text-lg max-w-xl mx-auto">
          Here&apos;s your question-by-question breakdown.
        </p>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Detailed Feedback by Question
      </h3>

      <div className="space-y-3">
        {result.questions.map((q: string, i: number) => {
          const isOpen = openIndex === i;
          const userAnswer = result.answers[i];

          return (
            <div key={i} className="bg-white rounded-xl shadow-md border p-4 transition">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex justify-between items-center text-left"
              >
                <div>
                  <p className="font-semibold text-gray-800">Question {i + 1}</p>
                  <p className="text-sm text-gray-500">{q}</p>
                </div>

                {isOpen ? (
                  <ChevronUp className="text-gray-600" />
                ) : (
                  <ChevronDown className="text-gray-600" />
                )}
              </button>

              {isOpen && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4 border">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Your Answer:</span>{" "}
                    {typeof userAnswer === "object"
                      ? JSON.stringify(userAnswer)
                      : userAnswer}
                  </p>

                  {result.feedback?.[i] && (
                    <>
                      <p className="font-semibold mt-3 text-gray-800">
                        Question Score: {result.feedback[i].questionScore}
                      </p>

                      <div className="mt-2 space-y-1">
                        {result.feedback[i].details.map(
                          (fb: string, idx: number) => (
                            <p key={idx} className="text-sm text-gray-600">
                              • {fb}
                            </p>
                          )
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("resumeResult");
            }
            router.push("/candidate/ai-test/upload");
          }}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-900 transition"
        >
          Back
        </button>
      </div>
    </div>
  );
}
