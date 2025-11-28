'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useEvaluateAnswers } from "../../../../features/AITest/hooks/aiTestApi";

import { ProgressDots } from "../components/quepProgress";
import { QuestionArea } from "../components/questionArea";

interface Question {
  id: string;
  question: string;
}

type AnswerContent = string | { text: string; code: string };

export default function InterviewPage() {
  const router = useRouter();
  const evaluateAnswers = useEvaluateAnswers();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);

  const [allAnswers, setAllAnswers] = useState<AnswerContent[]>([]);

  const [answerText, setAnswerText] = useState("");
  const [answerCode, setAnswerCode] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("interviewQuestions");
    if (!stored) {
      console.warn("No interview questions found. Redirecting to upload.");
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

  useEffect(() => {
    if (questions.length === 0) return;

    const storedAnswer = allAnswers[currentStep];

    if (typeof storedAnswer === "object" && storedAnswer !== null && "text" in storedAnswer && "code" in storedAnswer) {
      setAnswerText(storedAnswer.text);
      setAnswerCode(storedAnswer.code);
    } else {
      setAnswerText(String(storedAnswer || ""));
      setAnswerCode("");
    }
  }, [currentStep, questions, allAnswers]);

  const submitTest = async (finalAnswers: AnswerContent[]) => {
    try {
      const answersForBackend = finalAnswers.map((ans) => {
        if (typeof ans === "object" && ans !== null && "text" in ans && "code" in ans) {
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

    } catch (error) { 
      console.error("Submission Error:", error);
    }
  };

  const handleNextQuestion = () => {
    const currentAnswer: AnswerContent =
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

  const handlePreviousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
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

      <QuestionArea
        questionText={currentQuestion.question}
        isPending={evaluateAnswers.isPending}
        answerText={answerText}
        setAnswerText={setAnswerText}
        answerCode={answerCode}
        setAnswerCode={setAnswerCode}
      />

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentStep === 0}
          className={`px-6 py-3 text-lg font-semibold rounded-lg transition ${
            currentStep === 0
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gray-500 text-white hover:bg-gray-600"
          }`}
        >
          Back
        </button>

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
