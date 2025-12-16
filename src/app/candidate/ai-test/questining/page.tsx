"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useActiveQuestions } from "@/features/test/hooks/useActivation";
import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";
<<<<<<< HEAD
import { useSubmitResult } from "../../../../features/";
=======
import { useSubmitResult } from "@/features/test/hooks/useResultTest";
>>>>>>> merged/aish-ai

import Editor from "@monaco-editor/react";
import { KeyMod, KeyCode } from "monaco-editor";

import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  Circle,
  GripVertical,
} from "lucide-react";

import { useState, useRef, useCallback } from "react";

interface BaseQuestion {
  question: string;
  source?: "ai" | "test";
}

interface MCQQuestion extends BaseQuestion {
  options: string[];
}

interface CodeTextQuestion extends BaseQuestion {
  options?: never;
}

type Question = MCQQuestion | CodeTextQuestion;

interface CandidateAnswer {
  text?: string;
  code?: string;
}

interface ApiAnswer {
  text: string;
}

const MIN = 25;
const MAX = 75;
const INIT = 50;

export default function UniversalInterviewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useActiveQuestions() as {
    data: Question[];
    isLoading: boolean;
  };

  const evaluateMutation = useEvaluateAnswers();
  const submitMutation = useSubmitResult() as any;

  const isResumeTest = questions.some((q) => q.source === "ai");
  const isActiveTest = !isResumeTest;

  const testDuration = Number(localStorage.getItem("duration") ?? 0);

  const { data: secondsLeft = testDuration * 60 } = useQuery({
    queryKey: ["test-timer"],
    queryFn: async () => {
      const prev = queryClient.getQueryData<number>(["test-timer"]);
      return (prev ?? testDuration * 60) - 1;
    },
    refetchInterval: 1000,
    enabled: isActiveTest && testDuration > 0,
  });

  if (isActiveTest && secondsLeft <= 0) submit();

  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [answers, setAnswers] = useState<CandidateAnswer[]>([]);

  const current = questions[step];
  const isMCQ = Array.isArray((current as MCQQuestion)?.options);

  const progress = questions.length
    ? ((step + 1) / questions.length) * 100
    : 0;

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(INIT);
  const [dragging, setDragging] = useState(false);

  const prevent = (e: any) => e.preventDefault();

  const save = () => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[step] = isMCQ ? { text } : { text, code };
      return updated;
    });
  };

  const next = () => {
    save();
    step < questions.length - 1 ? setStep(step + 1) : submit();
  };

  const prev = () => {
    save();
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    const aiQ: string[] = [];
    const aiA: string[] = [];
    const fullAiAns: CandidateAnswer[] = [];
    const tq: string[] = [];
    const ta: ApiAnswer[] = [];

    questions.forEach((q, i) => {
      const ans = answers[i] || {};
      const primary = ans.text || ans.code || "";
      if (q.source === "ai") {
        aiQ.push(q.question);
        aiA.push(primary);
        fullAiAns.push(ans);
      } else {
        tq.push(q.question);
        ta.push({ text: primary });
      }
    });

    if (aiQ.length) {
      const res = await evaluateMutation.mutateAsync({
        questions: aiQ,
        answers: aiA,
      });

      sessionStorage.setItem(
        "resumeResult",
        JSON.stringify({
          questions: aiQ,
          answers: fullAiAns,
          score: res.data.score,
          percentage: res.data.percentage,
          feedback: res.data.feedback,
        })
      );

      router.push("/candidate/ai-test/result");
      return;
    }

    submitMutation.mutate(
      {
        attemptId: localStorage.getItem("attemptId") ?? "",
        testId: localStorage.getItem("testId") ?? "",
        email: localStorage.getItem("email") ?? "",
        questions: tq,
        answers: ta,
        score: 0,
        percentage: 0,
        isPassed: false,
        status: "Submitted",
        startTime: localStorage.getItem("startTime") ?? "",
        endTime: new Date().toISOString(),
        durationTaken: testDuration * 60 - secondsLeft,
      },
      { onSuccess: () => router.push("/candidate/ai-test/submitted") }
    );
  };

  const startDrag = useCallback(() => setDragging(true), []);
  const stopDrag = useCallback(() => setDragging(false), []);

  const onDrag = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const w = ((e.clientX - rect.left) / rect.width) * 100;
      setWidth(Math.max(MIN, Math.min(MAX, w)));
    },
    [dragging]
  );

  if (isLoading) return <p className="p-8 text-center">Preparing questions…</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="sticky top-0 bg-white/90 backdrop-blur border-b">
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-indigo-600" style={{ width: `${progress}%` }} />
        </div>

        <div className="px-6 py-4 flex items-center justify-between relative">
          <button onClick={prev} disabled={step === 0} className="p-2 rounded-full hover:bg-gray-100">
            <ChevronLeft />
          </button>

          {isActiveTest && (
            <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-indigo-700">
              ⏳ {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
            </div>
          )}

          <button onClick={next} className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700">
            {step === questions.length - 1 ? <Send /> : <ChevronRight />}
          </button>
        </div>

        <div className="px-6 pb-3 text-center font-medium text-gray-800">
          Q{step + 1}. {current.question}
        </div>
      </div>

<<<<<<< HEAD
      <div className="p-6 max-w-7xl mx-auto">
        <div ref={ref} className="flex min-h-[70vh] bg-white rounded-2xl shadow-lg overflow-hidden">
          {isMCQ ? (
            <div className="w-full p-10 grid gap-4 max-w-xl mx-auto">
              {(current as MCQQuestion).options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setText(opt)}
                  className={`flex items-center gap-3 p-4 rounded-xl border text-left transition ${
                    text === opt
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {text === opt ? (
                    <CheckCircle2 className="text-indigo-600" />
                  ) : (
                    <Circle className="text-gray-400" />
                  )}
                  {opt}
                </button>
              ))}
            </div>
=======
      <div className="p-6 max-w-8xl mx-auto">
        <div ref={ref} className="flex min-h-[70vh] bg-white rounded-2xl shadow-lg overflow-hidden">
          {isMCQ ? (
          <div className="w-full max-w-xl mx-auto p-6 space-y-3">
  {(current as MCQQuestion).options.map((opt, i) => {
    const optionLabel = String.fromCharCode(65 + i); // A, B, C, D

    return (
      <label
        key={i}
        className={`flex items-center gap-4 p-3 rounded-md border cursor-pointer transition
          ${
            text === opt
              ? "border-indigo-600 bg-indigo-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
      >
        {/* Radio */}
        <input
          type="radio"
          name="mcq"
          checked={text === opt}
          onChange={() => setText(opt)}
          className="hidden"
        />

        {/* Custom radio circle */}
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
            ${
              text === opt
                ? "border-indigo-600"
                : "border-gray-400"
            }`}
        >
          {text === opt && (
            <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />
          )}
        </div>

        {/* Option text */}
        <span className="text-sm font-medium text-gray-800">
          <span className="mr-2 font-semibold">{optionLabel}.</span>
          {opt}
        </span>
      </label>
    );
  })}
</div>

>>>>>>> merged/aish-ai
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPaste={prevent}
                onCopy={prevent}
                onCut={prevent}
                className="p-6 text-sm outline-none resize-none bg-gray-50"
                style={{ width: `${width}%` }}
              />

              <div
                className="w-2 bg-gray-200 hover:bg-indigo-400 cursor-col-resize flex items-center justify-center"
                onMouseDown={startDrag}
                onMouseUp={stopDrag}
                onMouseMove={onDrag}
              >
                <GripVertical className="text-gray-600" />
              </div>

<<<<<<< HEAD
              <div style={{ width: `${100 - width}%` }}>
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  theme="vs-dark"
                  onChange={(v) => setCode(v ?? "")}
                  onMount={(editor) => {
                    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
                    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
                    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
                    editor.updateOptions({ contextmenu: false });
                  }}
                />
              </div>
=======
             <div
  style={{ width: `${100 - width}%` }}
  className="flex flex-col border-l border-gray-700"
>
  {/* Header */}
  <div className="h-10 px-4 flex items-center justify-between bg-[#1e1e1e] border-b border-gray-700">
    <span className="text-sm font-semibold text-gray-200">
      💻 Code Editor
    </span>
    <span className="text-xs text-gray-400">
   
    </span>
  </div>

  {/* Editor */}
  <div className="flex-1">
    <Editor
      height="100%"
      defaultLanguage="javascript"
      value={code}
      theme="vs-dark"
      onChange={(v) => setCode(v ?? "")}
      onMount={(editor) => {
        editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
        editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
        editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
        editor.updateOptions({ contextmenu: false });
      }}
    />
  </div>
</div>

>>>>>>> merged/aish-ai
            </>
          )}
        </div>
      </div>
    </div>
  );
}
