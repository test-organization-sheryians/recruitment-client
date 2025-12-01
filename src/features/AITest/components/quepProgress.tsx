import React from "react";

interface ProgressDotsProps {
  total: number;
  current: number;
}

export const ProgressDots: React.FC<ProgressDotsProps> = ({ total, current }) => (
    <div className="flex justify-center space-x-2 my-4">
        {Array.from({ length: total }).map((_, index) => (
            <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                    index <= current ? "bg-teal-500" : "bg-gray-300"
                }`}
            />
        ))}
    </div>
);