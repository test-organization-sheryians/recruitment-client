import React from "react";

interface ScoreCircleProps {
    score: number;
    total: number;
}

export const ScoreCircle: React.FC<ScoreCircleProps> = ({ score, total }) => {
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