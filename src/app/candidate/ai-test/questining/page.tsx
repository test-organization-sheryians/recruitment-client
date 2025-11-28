"use client";

import { useState, useEffect } from "react";
import { useEvaluateAnswers } from "../features/hooks/aiTestApi";
import { useRouter } from "next/navigation";
import Editor from "@monaco-editor/react"; // ⭐ Added Monaco

// Progress Indicator
const ProgressDots: React.FC<{ total: number; current: number }> = ({
  total,
  current,
}) => (
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

// Question Model
interface Question {
  id: string;
  question: string;
}

export default function InterviewPage() {
  const router = useRouter();
  const evaluateAnswers = useEvaluateAnswers();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  // All answers combined
  const [allAnswers, setAllAnswers] = useState<
    (string | { text: string; code: string })[]
  >([]);

  // Current input fields
  const [answerText, setAnswerText] = useState("");
  const [answerCode, setAnswerCode] = useState("");

  // Load questions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("interviewQuestions");
    if (!stored) {
      alert("No interview questions found. Please upload your resume first.");
      router.push("/candidate/resume-upload");
      return;
    }

    try {
      const parsed: Question[] = JSON.parse(stored);
      setQuestions(parsed);
      setAllAnswers(new Array(parsed.length).fill(""));
    } catch (err) {
      console.error("Failed to parse interview questions:", err);
      router.push("/candidate/resume-upload");
    }
  }, [router]);

  // Set inputs when step changes
  useEffect(() => {
    if (questions.length === 0) return;

    const storedAnswer = allAnswers[currentStep];

    if (typeof storedAnswer === "object" && storedAnswer !== null) {
      setAnswerText(storedAnswer.text);
      setAnswerCode(storedAnswer.code);
    } else {
      setAnswerText(String(storedAnswer || ""));
      setAnswerCode("");
    }
  }, [currentStep, questions, allAnswers]);

  // Save and go to next question / submit
  const handleNextQuestion = () => {
    const currentAnswer =
      answerText.trim() || answerCode.trim()
        ? { text: answerText, code: answerCode }
        : "";

    const updated = [...allAnswers];
    updated[currentStep] = currentAnswer;
    setAllAnswers(updated);

    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      submitTest(updated);
    }
  };

  // Submit to backend
  const submitTest = async (finalAnswers: typeof allAnswers) => {
    try {
      const answersForBackend = finalAnswers.map((ans) => {
        if (typeof ans === "object" && ans !== null) {
          return `${ans.text}\n\n[CODE START]\n${ans.code}\n[CODE END]`;
        }
        return String(ans);
      });

      const payload = {
        questions: questions.map((q) => q.question),
        answers: answersForBackend,
      };

      const result = await evaluateAnswers.mutateAsync(payload);
      localStorage.setItem("interviewResult", JSON.stringify(result));
      router.push("/candidate/ai-test/result");
    } catch (err: any) {
      alert(`Submission Error: ${err.message}`);
    }
  };

  if (questions.length === 0) {
    return <div className="p-8 text-center">Loading interview questions...</div>;
  }

  const currentQuestion = questions[currentStep];
  const isLast = currentStep === questions.length - 1;
  const disabled =
    evaluateAnswers.isPending || (!answerText.trim() && !answerCode.trim());

  return (
    <div className="max-w-3xl mx-auto my-10 p-8 bg-white rounded-xl shadow-2xl">
      <h1 className="text-3xl font-extrabold text-gray-800 text-center mb-6">
        Question {currentStep + 1} of {questions.length}
      </h1>

      <ProgressDots total={questions.length} current={currentStep} />

      {/* Question */}
      <div className="bg-white p-6 rounded-t-xl border border-gray-200 mb-0 shadow-sm">
        <p className="text-xl font-medium text-gray-700">
          {currentQuestion.question}
        </p>
      </div>

      {/* Answer Input */}
      <div className="mb-8">
        {/* Text Answer */}
        <textarea
          value={answerText}
          onChange={(e) => setAnswerText(e.target.value)}
          rows={4}
          placeholder="Type your explanation or general answer here..."
          disabled={evaluateAnswers.isPending}
          className="w-full p-3 border-x border-t-0 border-b-0 border-gray-300 focus:outline-none resize-none"
        />

        {/* Monaco Code Editor */}
        <div className="border border-gray-900 rounded-b-lg mt-0">
          <Editor
            height="220px"
            defaultLanguage="javascript"
            value={answerCode}
            theme="vs-dark"
            onChange={(value) => setAnswerCode(value || "")}
            options={{
              fontSize: 14,
              minimap: { enabled: false },
              autoClosingBrackets: "always",
              automaticLayout: true,
              scrollBeyondLastLine: false,
              suggestOnTriggerCharacters: true,
              tabSize: 2,
            }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-gray-500">
          AI evaluates logic, efficiency, and security practices.
        </p>

        <button
          onClick={handleNextQuestion}
          disabled={disabled}
          className={`px-8 py-3 text-lg font-bold text-white rounded-lg transition ${
            disabled
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-teal-600 hover:bg-teal-700"
          }`}
        >
          {evaluateAnswers.isPending
            ? "Submitting..."
            : isLast
            ? "Submit Test"
            : "Submit Answer & Next"}
        </button>
      </div>
    </div>
  );
}
