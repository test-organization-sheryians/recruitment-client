"use client";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Code } from "lucide-react";

interface Question {
  id: number;
  question: string;
  topics: string[];
  constraints: string[];
  testCases: { input: string; output: string }[];
  explanation: string;
  aiSolution: string;
}

interface ResumeResponse {
  success: boolean;
  questions: Question[];
  source: string;
  text: string;
  pageCount: number;
}

const ResumeResult = ({ data }: { data: ResumeResponse }) => {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6 text-center text-[#1270B0]">
        Resume Parsing Results
      </h1>

      {/* Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-[#E9EFF7] rounded-lg text-center">
          <p className="font-medium">Status</p>
          <p className="text-green-600 font-semibold">
            {data.success ? "Success ✅" : "Failed ❌"}
          </p>
        </div>
        <div className="p-4 bg-[#E9EFF7] rounded-lg text-center">
          <p className="font-medium">Source</p>
          <p className="text-[#1270B0] font-semibold">{data.source}</p>
        </div>
        <div className="p-4 bg-[#E9EFF7] rounded-lg text-center">
          <p className="font-medium">Pages</p>
          <p className="font-semibold">{data.pageCount}</p>
        </div>
      </div>

      {/* Questions */}
      <h2 className="text-2xl font-medium mb-4">Extracted Questions</h2>
      <div className="space-y-4">
        {data.questions.map((q) => (
          <div
            key={q.id}
            className="border rounded-lg shadow-sm bg-white p-4"
          >
            <div
              className="flex justify-between items-center cursor-pointer"
              onClick={() => setExpanded(expanded === q.id ? null : q.id)}
            >
              <h3 className="font-semibold text-lg text-[#1270B0]">
                {q.id}. {q.question}
              </h3>
              {expanded === q.id ? <ChevronUp /> : <ChevronDown />}
            </div>

            {expanded === q.id && (
              <div className="mt-3 space-y-2 text-sm">
                <p>
                  <span className="font-medium">Topics:</span>{" "}
                  {q.topics.join(", ")}
                </p>
                <p>
                  <span className="font-medium">Constraints:</span>{" "}
                  {q.constraints.join(", ")}
                </p>
                <p>
                  <span className="font-medium">Explanation:</span> {q.explanation}
                </p>
                <div>
                  <p className="font-medium">Test Cases:</p>
                  <ul className="list-disc ml-6">
                    {q.testCases.map((t, idx) => (
                      <li key={idx}>
                        <strong>Input:</strong> {t.input}{" "}
                        <strong>→ Output:</strong> {t.output}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium flex items-center gap-1">
                    <Code size={16} /> AI Solution:
                  </p>
                  <pre className="bg-gray-900 text-green-300 text-xs p-3 rounded-lg mt-1 overflow-x-auto">
                    {q.aiSolution}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Raw Text */}
      <h2 className="text-2xl font-medium mt-8 mb-4 flex items-center gap-2">
        <FileText size={22} className="text-[#1270B0]" /> Extracted Text
      </h2>
      <div className="bg-gray-100 rounded-lg p-4 h-60 overflow-y-scroll text-sm whitespace-pre-wrap">
        {data.text}
      </div>
    </div>
  );
};

export default ResumeResult;