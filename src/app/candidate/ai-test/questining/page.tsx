"use client";

import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useActiveQuestions } from "@/features/test/hooks/useActivation";
import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";
import { useSubmitResult } from "@/features/test/hooks/useResultTest";

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

import { useState, useRef, useCallback, useEffect } from "react";

/* ================= TYPES ================= */

interface BaseQuestion {
  question: string;
  difficulty?: string;
  explanation?: string;
  source?: "ai" | "test";
}

interface MCQQuestion extends BaseQuestion {
  options: string[];
  correct?: number;
}

interface TextQuestion extends BaseQuestion {
  options?: never;
}

type Question = MCQQuestion | TextQuestion;

interface CandidateAnswer {
  text?: string;
  code?: string;
}

interface ApiAnswer {
  text: string;
}

/* ================= CONSTANTS ================= */

const MIN = 25;
const MAX = 75;
const INIT = 50;

/* ================= HELPERS ================= */

const isMCQ = (q?: Question): q is MCQQuestion =>
  !!q && Array.isArray((q as MCQQuestion).options);

/* ================= PAGE ================= */

export default function UniversalInterviewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useActiveQuestions() as {
    data: Question[];
    isLoading: boolean;
  };

  const evaluateMutation = useEvaluateAnswers();
  const submitMutation = useSubmitResult();

  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [answers, setAnswers] = useState<CandidateAnswer[]>([]);

  const current = questions[step];

  /* ================= TEST TYPE ================= */

  const isResumeTest = questions.some((q) => q.source === "ai");
  const isActiveTest = !isResumeTest;

  /* ================= TIMER ================= */

  const testDuration =
    typeof window !== "undefined"
      ? Number(localStorage.getItem("duration") ?? 0)
      : 0;

  const { data: secondsLeft = testDuration * 60 } = useQuery({
    queryKey: ["test-timer"],
    queryFn: async () => {
      const prev = queryClient.getQueryData<number>(["test-timer"]);
      return (prev ?? testDuration * 60) - 1;
    },
    refetchInterval: 1000,
    enabled: isActiveTest && testDuration > 0,
  });

  /* ⛔ NEVER submit inside render */
  useEffect(() => {
    if (isActiveTest && secondsLeft <= 0) submit();
  }, [secondsLeft]);

  /* ================= RESTORE ANSWER ================= */

  useEffect(() => {
    const prev = answers[step];
    setText(prev?.text ?? "");
    setCode(prev?.code ?? "");
  }, [step]);

  /* ================= SAVE ================= */

  const save = () => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[step] = isMCQ(current) ? { text } : { text, code };
      return copy;
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
      const value = ans.text || ans.code || "";

      if (q.source === "ai") {
        aiQ.push(q.question);
        aiA.push(value);
        fullAiAns.push(ans);
      } else {
        tq.push(q.question);
        ta.push({ text: value });
      }
    });

    /* AI TEST */
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
      {
        onSuccess: () => router.push("/candidate/ai-test/submitted"),
      }
    );
  };



  if (isLoading)
    return <p className="p-8 text-center">Preparing questions…</p>;

  if (!current)
    return <p className="p-8 text-center">No questions found</p>;

  const progress = ((step + 1) / questions.length) * 100;

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(INIT);
  const [dragging, setDragging] = useState(false);

  const onDrag = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const w = ((e.clientX - rect.left) / rect.width) * 100;
      setWidth(Math.max(MIN, Math.min(MAX, w)));
    },
    [dragging]
  );

  const prevent = (e: any) => e.preventDefault();



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white">
      <div className="sticky top-0 bg-white/90 backdrop-blur border-b">
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-indigo-600"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-6 py-4 flex items-center justify-between relative">
          <button onClick={prev} disabled={step === 0}>
            <ChevronLeft />
          </button>

          {isActiveTest && (
            <div className="absolute left-1/2 -translate-x-1/2 font-semibold">
              ⏳ {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </div>
          )}

          <button onClick={next}>
            {step === questions.length - 1 ? <Send /> : <ChevronRight />}
          </button>
        </div>

        <div className="px-6 pb-3 text-center font-medium">
          Q{step + 1}. {current.question}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto">
        <div ref={ref} className="flex min-h-[70vh] bg-white rounded-2xl shadow">
          {isMCQ(current) ? (
            <div className="w-full p-10 grid gap-4 max-w-xl mx-auto">
              {current.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setText(opt)}
                  className={`p-4 border rounded-xl flex gap-3 ${
                    text === opt ? "border-indigo-600 bg-indigo-50" : ""
                  }`}
                >
                  {text === opt ? <CheckCircle2 /> : <Circle />}
                  {opt}
                </button>
              ))}
            </div>
          ) : (
            <>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onPaste={prevent}
                onCopy={prevent}
                onCut={prevent}
                style={{ width: `${width}%` }}
                className="p-6 resize-none bg-gray-50"
              />

              <div
                className="w-2 cursor-col-resize"
                onMouseDown={() => setDragging(true)}
                onMouseUp={() => setDragging(false)}
                onMouseMove={onDrag}
              >
                <GripVertical />
              </div>

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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
