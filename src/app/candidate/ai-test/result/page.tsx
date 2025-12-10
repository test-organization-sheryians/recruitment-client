"use client";

import { useQuery } from "@tanstack/react-query";
import { ScoreCircle } from "../../../../features/AITest/components/score";
import { DetailedFeedbackCard } from "../../../../features/AITest/components/feeedback";

interface QuestionEvaluation {
  score: number;
  feedback: string;
}

interface InterviewResult {
  success: boolean;
  evaluations: QuestionEvaluation[];
  total: number;
}

const getInterviewResult = (): InterviewResult | null => {
  const saved = localStorage.getItem("interviewResult");
  return saved ? JSON.parse(saved) : null;
};

export default function ResultPage() {
  const { data: result, isLoading } = useQuery({
    queryKey: ["interview-result"],
    queryFn: getInterviewResult,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  if (isLoading) {
    return <p className="p-8 text-center">Loading interview results...</p>;
  }

  if (!result) {
    return <p className="p-8 text-center text-red-500">No evaluation found.</p>;
  }

  const totalScore = result.evaluations.reduce((sum, q) => sum + q.score, 0);
  const totalQuestions = result.total ?? result.evaluations.length;

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
        Your Results
      </h1>
      <p className="text-center text-gray-500 mb-8">
        Interview Completed
      </p>

      <div className="flex justify-center mb-8">
        <ScoreCircle score={totalScore} total={totalQuestions} />
      </div>

      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Question Feedback
      </h2>

      <div className="space-y-3">
        {result.evaluations.map((evalItem, index) => (
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
