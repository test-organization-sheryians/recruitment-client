"use client";
import React from "react";

interface Props {
  current: number;
  total: number;
  question: string;
  disabled: boolean;
  onPrev: () => void;
  onNext: () => void;
  isLast: boolean;
  isLoading: boolean;
}

export default function QuestionHeader({
  current,
  total,
  question,
  disabled,
  onPrev,
  onNext,
  isLast,
  isLoading
}: Props) {
  return (
    <div className="flex justify-between items-center mb-6 w-full">
      <button
        onClick={onPrev}
        disabled={current === 0}
        className={`px-6 py-3 rounded-xl border border-gray-300 text-sm font-medium ${
          current === 0 ? "bg-gray-100 text-gray-500" : "bg-white hover:bg-gray-50"
        }`}
      >
        ⟵ Previous
      </button>

      <div className="text-lg font-semibold text-gray-900 px-4 max-w-[60%] text-center">
        <span className="font-bold mr-2">Q.{current + 1}/{total}:</span>
        {question}
      </div>

      <button
        onClick={onNext}
        disabled={disabled}
        className={`px-8 py-3 rounded-xl font-bold text-sm ${
          disabled ? "bg-gray-400 text-gray-100 cursor-not-allowed" : "bg-[#3668FF] text-white"
        }`}
      >
        {isLoading ? "Processing..." : isLast ? "Submit Test" : "Next →"}
      </button>
    </div>
  );
}
