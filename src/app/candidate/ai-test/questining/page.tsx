"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor as MonacoEditor, KeyMod, KeyCode } from "monaco-editor";
import { useEvaluateAnswers } from "../../../../features/AITest/hooks/aiTestApi";

interface Question {
  id?: string;
  question: string;
  options?: string[]; // 👈 added for MCQ flexibility
}

type AnswerContent = string | { text: string; code: string };

interface ProgressData {
  currentStep: number;
  allAnswers: AnswerContent[];
  answerText: string;
  answerCode: string;
  finished: boolean;
}

export default function InterviewPage() {
  const router = useRouter();
  const evaluateAnswers = useEvaluateAnswers();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [allAnswers, setAllAnswers] = useState<AnswerContent[]>([]);
  const [answerText, setAnswerText] = useState("");
  const [answerCode, setAnswerCode] = useState("");
  const [finished, setFinished] = useState(false);

  const saveProgress = (data: ProgressData) => {
    localStorage.setItem("interview_progress", JSON.stringify(data));
  };

  const preventClipboardEvent = useCallback((e: ClipboardEvent | any) => e.preventDefault(), []);
  const preventContextMenu = useCallback((e: any) => e.preventDefault(), []);
  const preventDrop = useCallback((e: any) => e.preventDefault(), []);
  const handleKeyDownBlockClipboard = useCallback((e: any) => {
    const key = e.key?.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(key)) e.preventDefault();
    if (e.shiftKey && e.key === "Insert") e.preventDefault();
  }, []);

  // Load Questions
  useEffect(() => {
    const storedTest = localStorage.getItem("currentTestQuestions"); // 👈 new
    const storedInterview = localStorage.getItem("interviewQuestions"); // old resume based

    const source = storedTest || storedInterview;

    if (!source) {
      router.push("/candidate/resume-upload");
      return;
    }

    const parsed: Question[] = JSON.parse(source);
    setQuestions(parsed);

    const saved = localStorage.getItem("interview_progress");
    if (saved) {
      const p: ProgressData = JSON.parse(saved);
      setCurrentStep(p.currentStep || 0);
      setAllAnswers(p.allAnswers || new Array(parsed.length).fill(""));
      setAnswerText(p.answerText || "");
      setAnswerCode(p.answerCode || "");
      setFinished(p.finished || false);
    } else {
      setAllAnswers(new Array(parsed.length).fill(""));
    }
  }, [router]);

  useEffect(() => {
    if (questions.length === 0) return;

    const stored = allAnswers[currentStep];

    if (stored && typeof stored === "object") {
      setAnswerText(stored.text || "");
      setAnswerCode(stored.code || "");
    } else {
      setAnswerText(typeof stored === "string" ? stored : "");
      setAnswerCode("");
    }
  }, [currentStep, allAnswers, questions]);

  // Detect MCQ
  const currentQuestion = questions[currentStep];
  const isMCQ = Array.isArray(currentQuestion?.options);

  const disabled = isMCQ
    ? !answerText
    : evaluateAnswers.isPending || (!answerText.trim() && !answerCode.trim());

  const isLast = currentStep === questions.length - 1;

  const handleTextChange = (value: string) => {
    setAnswerText(value);
    saveProgress({ currentStep, allAnswers, answerText: value, answerCode, finished });
  };

  const handleCodeChange = (value: string) => {
    setAnswerCode(value);
    saveProgress({ currentStep, allAnswers, answerText, answerCode: value, finished });
  };

  const submitTest = async (finalAnswers: AnswerContent[]) => {
    try {
      const formatted = finalAnswers.map((ans) =>
        typeof ans === "object" ? `${ans.text}\n\n${ans.code}` : ans
      );

      const payload = {
        questions: questions.map((q) => q.question),
        answers: formatted,
      };

      const result = await evaluateAnswers.mutateAsync(payload);
      localStorage.setItem("interviewResult", JSON.stringify(result));

      saveProgress({ currentStep, allAnswers, answerText, answerCode, finished: true });
      router.push("/candidate/ai-test/result");
    } catch (err) {
      console.error(err);
    }
  };

  const handleNext = () => {
    const currentAnswer: AnswerContent = isMCQ
      ? answerText
      : answerText.trim() || answerCode.trim()
      ? { text: answerText, code: answerCode }
      : "";

    const updated = [...allAnswers];
    updated[currentStep] = currentAnswer;

    setAllAnswers(updated);

    if (!isLast) {
      const next = currentStep + 1;
      saveProgress({ currentStep: next, allAnswers: updated, answerText: "", answerCode: "", finished });
      setCurrentStep(next);
      setAnswerText("");
      setAnswerCode("");
    } else {
      submitTest(updated);
    }
  };

  if (!questions.length) return <p className="p-6 text-center">Loading...</p>;

  const handleEditorMount: OnMount = (editor) => {
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
    editor.addCommand(KeyMod.Shift | KeyCode.Insert, () => {});
    editor.updateOptions({ contextmenu: false });

    const node = editor.getDomNode();
    if (node) {
      node.addEventListener("paste", (e) => e.preventDefault());
      node.addEventListener("drop", (e) => e.preventDefault());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto py-6 px-4">

        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => currentStep > 0 && setCurrentStep(currentStep - 1)}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-xl border ${currentStep === 0 ? "bg-gray-200 cursor-not-allowed" : "bg-white hover:bg-gray-50"}`}
          >
            ⟵ Previous
          </button>

          <h2 className="text-lg font-semibold max-w-[60%] text-center select-none"
            onCopy={preventClipboardEvent}
            onCut={preventClipboardEvent}
            onPaste={preventClipboardEvent}
            onContextMenu={preventContextMenu}
          >
            Q.{currentStep + 1}: {currentQuestion.question}
          </h2>

          <button
            onClick={handleNext}
            disabled={disabled}
            className={`px-8 py-3 rounded-xl font-bold ${disabled ? "bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"}`}
          >
            {isLast ? "Submit Test" : "Next →"}
          </button>
        </div>

        {/* Conditional Rendering */}
        {isMCQ ? (
          <div className="space-y-4">
            {currentQuestion.options?.map((opt, idx) => (
              <label
                key={idx}
                onClick={() => handleTextChange(opt)}
                className={`block p-4 border rounded-xl cursor-pointer ${answerText === opt ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"}`}
              >
                <input type="radio" checked={answerText === opt} readOnly className="mr-2" />
                {opt}
              </label>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            <textarea
              className="w-full min-h-[500px] p-4 border rounded-lg"
              value={answerText}
              placeholder="Write explanation..."
              onChange={(e) => handleTextChange(e.target.value)}
              onPaste={preventClipboardEvent}
              onCopy={preventClipboardEvent}
              onCut={preventClipboardEvent}
              onDrop={preventDrop}
              onKeyDown={handleKeyDownBlockClipboard}
              onContextMenu={preventContextMenu}
            />

            <div className="bg-black rounded-lg overflow-hidden">
              <Editor
                height="500px"
                defaultLanguage="javascript"
                value={answerCode}
                onChange={(value) => handleCodeChange(value || "")}
                theme="vs-dark"
                onMount={handleEditorMount}
                options={{ minimap: { enabled: false }, wordWrap: "on", fontSize: 14 }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
