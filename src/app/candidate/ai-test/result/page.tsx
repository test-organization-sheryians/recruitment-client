'use client';

import { useEffect, useState } from "react";

// --- Data Structures ---
interface QuestionEvaluation {
    score: number;
    feedback: string;
}

interface InterviewResult {
    success: boolean;
    evaluations: QuestionEvaluation[];
    total: number;
}

// --- Score Circle ---
const ScoreCircle: React.FC<{ score: number; total: number }> = ({ score, total }) => {
    const percentage = total ? Math.round((score / total) * 100) : 0;
    const color =
        percentage >= 80
            ? "border-teal-500"
            : percentage >= 50
            ? "border-amber-500"
            : "border-red-500";

    return (
        <div
            className={`w-32 h-32 flex flex-col items-center justify-center rounded-full border-4 ${color} text-gray-800`}
        >
            <span className="text-3xl font-extrabold">{score}/{total}</span>
            <span className="text-sm text-gray-500">{percentage}%</span>
        </div>
    );
};

// --- Collapsible Feedback Card ---
const DetailedFeedbackCard: React.FC<{ evaluation: QuestionEvaluation; index: number }> = ({ evaluation, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const scoreColor = evaluation.score ? "text-green-600" : "text-red-600";

    return (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
            <button
                className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>Question {index + 1}</span>
                <span className={`text-lg font-bold ${scoreColor}`}>{evaluation.score}</span>
                <span className="text-xl text-gray-500">{isOpen ? "▲" : "▼"}</span>
            </button>

            {isOpen && (
                <div className="p-4 border-t border-gray-100 bg-gray-50">
                    <h4 className="font-bold text-sm mb-1 text-red-500">AI Feedback:</h4>
                    <p className="text-gray-700">{evaluation.feedback}</p>
                </div>
            )}
        </div>
    );
};

export default function ResultPage() {
    const [result, setResult] = useState<InterviewResult | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("interviewResult");
        if (!data) return;

        try {
            const parsed: InterviewResult = JSON.parse(data);
            setResult(parsed);
        } catch (err) {
            console.error("Failed to parse interviewResult:", err);
        }
    }, []);

    if (!result)
        return <p className="p-8 text-center">Loading interview results...</p>;

    const totalScore = result.evaluations.reduce((sum, q) => sum + q.score, 0);
    const totalQuestions = result.total || result.evaluations.length;

    return (
        <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-2xl">
            <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
                Your Results 
            </h1>
            <p className="text-center text-gray-500 mb-8">Interview Evaluation Complete</p>

            {/* Score Summary */}
            <div className="flex justify-center mb-8">
                <ScoreCircle score={totalScore} total={totalQuestions} />
            </div>

            {/* Detailed Feedback */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Detailed Feedback by Question
            </h2>

            <div className="space-y-3">
                {result.evaluations.map((evalItem, index) => (
                    <DetailedFeedbackCard key={index} evaluation={evalItem} index={index} />
                ))}
            </div>

            <div className="text-center mt-8">
                <button className="py-3 px-8 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition">
                    Download Full Report
                </button>
            </div>
        </div>
    );
}
