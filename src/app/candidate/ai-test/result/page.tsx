'use client';

import { useEffect, useState } from "react";

// Import Components
import { ScoreCircle } from "../../../../features/AITest/components/score" // Adjust path as necessary
import { DetailedFeedbackCard } from "../../../../features/AITest/components/feeedback"; // Adjust path as necessary

// --- Data Structures ---
interface QuestionEvaluation {
    score: number;
    feedback: string;
}

interface InterviewResult {
    data:{
        success: boolean;
    evaluations: QuestionEvaluation[];
    total: number; // Total possible score/total number of questions evaluated
    }
    
}

export default function ResultPage() {
    const [result, setResult] = useState<InterviewResult | null>(null);

    useEffect(() => {
        const data = localStorage.getItem("interviewResult");
        if (!data) return;

        try {

            const parsed: InterviewResult = JSON.parse(data.data);
            setResult(parsed);
        } catch (err) {
            console.error("Failed to parse interviewResult:", err);
        }
    }, []);

    if (!result)
        return <p className="p-8 text-center">Loading interview results...</p>;

    // Calculate total score and total evaluation points

    console.log(result.data)
    const totalScore = result.data.evaluations.reduce((sum, q) => sum + q.score, 0);

    const totalQuestions = result.data.total || result.data.evaluations.length; 

    return (
        <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-2xl">
            <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-2">
                Your Results 
            </h1>
            <p className="text-center text-gray-500 mb-8">Interview Evaluation Complete</p>

            {/* Score Summary */}
            <div className="flex justify-center mb-8">
                {/* ScoreCircle takes the calculated total score and the total number of items (totalQuestions) */}
                <ScoreCircle score={totalScore} total={totalQuestions} />
            </div>

            {/* Detailed Feedback */}
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                Detailed Feedback by Question
            </h2>

            <div className="space-y-3">
                {result.data.evaluations.map((evalItem, index) => (
                    <DetailedFeedbackCard key={index} evaluation={evalItem} index={index} />
                ))}
            </div>

           
        </div>
    );
}