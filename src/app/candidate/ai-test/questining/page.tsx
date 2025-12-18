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


const MIN = 25;
const MAX = 75;
const INIT = 50;


const isMCQ = (q?: Question): q is MCQQuestion =>
  !!q &&
  Array.isArray((q as MCQQuestion).options) &&
  (q as MCQQuestion).options.length > 0;



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


  const isResumeTest = questions.some((q) => q.source === "ai");
  const isActiveTest = !isResumeTest;


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

  useEffect(() => {
    if (isActiveTest && secondsLeft <= 0) submit();
  }, [secondsLeft]);

  

  useEffect(() => {
    const prev = answers[step];
    setText(prev?.text ?? "");
    setCode(prev?.code ?? "");
  }, [step]);


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
  <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b">
      {/* Progress bar */}
      <div className="h-1 bg-gray-200">
        <div
          className="h-full bg-indigo-600 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-6 py-3 flex items-center justify-between relative">
        <button
          onClick={prev}
          disabled={step === 0}
          className="px-4 py-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 disabled:opacity-40 transition"
        >
          <ChevronLeft />
        </button>

        {isActiveTest && (
          <div className="absolute left-1/2 -translate-x-1/2 font-semibold text-gray-700 text-sm">
             {Math.floor(secondsLeft / 60)}:
            {String(secondsLeft % 60).padStart(2, "0")}
          </div>
        )}

        <button
          onClick={next}
          className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          {step === questions.length - 1 ? <Send /> : <ChevronRight />}
        </button>
      </div>

      <div className="px-6 pb-2 text-center">
        <p className="text-xs text-gray-500 mb-0.5">
          Question {step + 1} of {questions.length}
        </p>
        <h2 className="text-base font-semibold text-gray-800 max-w-3xl mx-auto">
          {current.question}
        </h2>
      </div>
    </div>

    <div className="p-6 max-w-8xl mx-auto">
      <div
        ref={ref}
        className="flex min-h-[68vh] bg-white rounded-2xl shadow-lg overflow-hidden"
      >
      
        {isMCQ(current) ? (
          <div className="w-full p-8 grid gap-3 max-w-2xl mx-auto">
            {current.options.map((opt, i) => {
              const selected = text === opt;
              return (
                <button
                  key={i}
                  onClick={() => setText(opt)}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all
                    ${
                      selected
                        ? "border-indigo-600 bg-indigo-50 shadow-sm"
                        : "border-gray-300 hover:border-indigo-400 hover:bg-gray-50"
                    }`}
                >
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border
                      ${
                        selected
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-gray-400"
                      }`}
                  >
                    {selected && <CheckCircle2 size={14} />}
                  </span>
                  <span className="text-left text-gray-800 text-sm">
                    {opt}
                  </span>
                </button>
              );
            })}
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
              className="p-5 resize-none outline-none bg-gray-50 border-r text-gray-800 text-sm"
              placeholder="Write your answer here..."
            />

            <div
              className="w-3 bg-gray-100 hover:bg-indigo-100 cursor-col-resize flex items-center justify-center"
              onMouseDown={() => setDragging(true)}
              onMouseUp={() => setDragging(false)}
              onMouseLeave={() => setDragging(false)}
              onMouseMove={onDrag}
            >
              <GripVertical className="text-gray-400" />
            </div>

            <div
              style={{ width: `${100 - width}%` }}
              className="flex flex-col bg-gray-900"
            >
              <div className="px-4 py-2 bg-gray-800 text-gray-200 text-sm font-medium border-b border-gray-700">
                 Code Editor
              </div>

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
