import React, { useState } from "react";

interface QuestionEvaluation {
    score: number;
    feedback: string;
}

interface DetailedFeedbackCardProps {
    evaluation: QuestionEvaluation;
    index: number;
}

export const DetailedFeedbackCard: React.FC<DetailedFeedbackCardProps> = ({ evaluation, index }) => {
    const [isOpen, setIsOpen] = useState(false);
    const scoreColor = evaluation.score > 0 ? "text-green-600" : "text-red-600";

    return (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
            <button
                className="flex justify-between items-center w-full p-4 text-left font-semibold text-gray-800"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span>Question {index + 1}</span>
                <span className={`text-lg font-bold ${scoreColor}`}>{evaluation.score}</span>
                <span className="text-xl text-gray-500 transition-transform duration-300">
                    {isOpen ? "▲" : "▼"}
                </span>
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