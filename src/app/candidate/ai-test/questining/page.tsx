"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Editor, { OnMount } from "@monaco-editor/react";
import { editor as MonacoEditor, KeyMod, KeyCode } from "monaco-editor";
import { useEvaluateAnswers } from "../../../../features/AITest/hooks/aiTestApi";

interface Question {
  id: string;
  question: string;
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

  // Save progress (fixed typing)
  const saveProgress = (data: ProgressData) => {
    try {
      localStorage.setItem("interview_progress", JSON.stringify(data));
    } catch (err) {
      console.warn("Failed to save progress", err);
    }
  };



  const preventClipboardEvent = useCallback(
    (e: React.ClipboardEvent | ClipboardEvent) => {
      e.preventDefault();
    },
    []
  );

  const preventContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
  }, []);

  const preventDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleKeyDownBlockClipboard = useCallback(
    (e: React.KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(key)) {
        e.preventDefault();
      }
      if (e.shiftKey && e.key === "Insert") {
        e.preventDefault();
      }
    },
    []
  );

 
  useEffect(() => {
    const stored = localStorage.getItem("interviewQuestions");
    if (!stored) {
      router.push("/candidate/resume-upload");
      return;
    }

    const parsed: Question[] = JSON.parse(stored);
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

  // Answer updates
  const handleTextChange = (value: string) => {
    setAnswerText(value);
    saveProgress({
      currentStep,
      allAnswers,
      answerText: value,
      answerCode,
      finished,
    });
  };

  const handleCodeChange = (value: string) => {
    setAnswerCode(value);
    saveProgress({
      currentStep,
      allAnswers,
      answerText,
      answerCode: value,
      finished,
    });
  };

  // Submit Test
  const submitTest = async (finalAnswers: AnswerContent[]) => {
    try {
      const formatted = finalAnswers.map((ans) =>
        typeof ans === "object"
          ? `${ans.text}\n\n[CODE START]\n${ans.code}\n[CODE END]`
          : String(ans)
      );

      const payload = {
        questions: questions.map((q) => q.question),
        answers: formatted,
      };

      const result = await evaluateAnswers.mutateAsync(payload);
      localStorage.setItem("interviewResult", JSON.stringify(result));

      saveProgress({
        currentStep,
        allAnswers,
        answerText,
        answerCode,
        finished: true,
      });

      router.push("/candidate/ai-test/result");
    } catch (error) {
      console.error("Submission Error:", error);
    }
  };

  // Next Question
  const handleNext = () => {
    const currentAnswer: AnswerContent =
      answerText.trim() || answerCode.trim()
        ? { text: answerText, code: answerCode }
        : "";

    const updated = [...allAnswers];
    updated[currentStep] = currentAnswer;
    setAllAnswers(updated);

    if (currentStep < questions.length - 1) {
      const next = currentStep + 1;

      saveProgress({
        currentStep: next,
        allAnswers: updated,
        answerText: "",
        answerCode: "",
        finished,
      });

      setCurrentStep(next);
      setAnswerText("");
      setAnswerCode("");
    } else {
      submitTest(updated);
    }
  };

  // Previous
  const handlePrevious = () => {
    if (currentStep === 0) return;
    setCurrentStep(currentStep - 1);
  };

  if (!questions.length)
    return <div className="text-center p-6">Loading...</div>;

  const currentQuestion = questions[currentStep];
  const disabled = evaluateAnswers.isPending || (!answerText.trim() && !answerCode.trim());
  const isLast = currentStep === questions.length - 1;


  const handleEditorMount: OnMount = (
    editor: MonacoEditor.IStandaloneCodeEditor,
    
  ) => {
    try {
      editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
      editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
      editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
      editor.addCommand(KeyMod.Shift | KeyCode.Insert, () => {});
      editor.updateOptions({ contextmenu: false });

      const node = editor.getDomNode();
      if (node) {
        node.addEventListener("paste", (e: ClipboardEvent) =>
          e.preventDefault()
        );
        node.addEventListener("drop", (e: DragEvent) =>
          e.preventDefault()
        );
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="mx-auto py-6 px-4">

        <div className="flex justify-between items-center mb-6 w-full">
         
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-xl border border-gray-300 text-sm font-medium ${
              currentStep === 0
                ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-50 text-gray-800 shadow-sm"
            }`}
          >
            ⟵ Previous
          </button>

     
          <div
            className="text-lg font-semibold text-gray-900 px-4 select-none text-center max-w-[60%]"
            onCopy={preventClipboardEvent}
            onCut={preventClipboardEvent}
            onPaste={preventClipboardEvent}
            onKeyDown={handleKeyDownBlockClipboard}
            onContextMenu={preventContextMenu}
          >
            <span className="font-bold mr-2">Q.{currentStep + 1}:</span>
            {currentQuestion.question}
          </div>

          <button
            onClick={handleNext}
            disabled={disabled}
            className={`px-8 py-3 rounded-xl font-bold text-sm ${
              disabled
                ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                : "bg-[#3668FF] text-white hover:bg-[#0733b5]"
            }`}
          >
            {evaluateAnswers.isPending
              ? "Processing..."
              : isLast
              ? "Submit Test"
              : "Next →"}
          </button>
        </div>

        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          📝 Problem Solution
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        
          <textarea
            className="w-full min-h-[500px] p-4 border border-gray-300 rounded-lg bg-white text-base outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            placeholder="Write your explanation..."
            value={answerText}
            onChange={(e) => handleTextChange(e.target.value)}
            onPaste={preventClipboardEvent}
            onCopy={preventClipboardEvent}
            onCut={preventClipboardEvent}
            onDrop={preventDrop}
            onKeyDown={handleKeyDownBlockClipboard}
            onContextMenu={preventContextMenu}
          />

      
          <div className="bg-gray-900 rounded-lg overflow-hidden shadow-xl">
            <div className="px-5 py-3 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-gray-100 font-medium tracking-wide">
                💻 Your Code
              </h3>
              <span className="text-xs text-gray-400">Auto-save enabled</span>
            </div>

            <Editor
              height="500px"
              defaultLanguage="javascript"
              value={answerCode}
              onChange={(value) => handleCodeChange(value || "")}
              theme="vs-dark"
              onMount={handleEditorMount}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: "on",
                contextmenu: false,
              }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}
