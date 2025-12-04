'use client';

import { useQuery } from "@tanstack/react-query";
import { ScoreCircle } from "../../../../features/AITest/components/score";
import { DetailedFeedbackCard } from "../../../../features/AITest/components/feeedback";

interface QuestionEvaluation {
  score: number;
  feedback: string;
}

interface InterviewResult {
  data: {
    success: boolean;
    evaluations: QuestionEvaluation[];
    total: number;
  };
}

const getInterviewResult = async (): Promise<InterviewResult | null> => {
  const saved = localStorage.getItem("interviewResult");

  if (!saved) return null;

  try {
    return JSON.parse(saved);
  } catch (error) {
    console.error("Failed to parse interviewResult:", error);
    return null;
  }
};


export default function ResultPage() {
  // ⬇️ Use TanStack Query
  const { data: result, isLoading, isError } = useQuery({
    queryKey: ["interview-result"],
    queryFn: getInterviewResult,
    staleTime: Infinity,     
    gcTime: Infinity,         
  });

  if (isLoading) {
    return <p className="p-8 text-center">Loading interview results...</p>;
  }

  if (!result || isError) {
    return (
      <p className="p-8 text-center text-red-500">
        Failed to load results.
      </p>
    );
  }

  const totalScore = result.data.evaluations.reduce(
    (sum, q) => sum + q.score,
    0
  );

  const totalQuestions =
    result.data.total || result.data.evaluations.length;

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
        Your Results
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Interview Evaluation Complete
      </p>

      <div className="flex justify-center mb-8">
        <ScoreCircle score={totalScore} total={totalQuestions} />
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Detailed Feedback by Question
      </h2>

      <div className="space-y-3">
        {result.data.evaluations.map((evalItem, index) => (
          <DetailedFeedbackCard
            key={index}
            evaluation={evalItem}
            index={index}
          />
        ))}
      </div>
    </div>
  );
}
