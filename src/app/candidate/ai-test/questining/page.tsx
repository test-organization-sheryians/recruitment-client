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
  GripVertical,
} from "lucide-react";

import { useState, useRef, useCallback, useEffect } from "react";


interface Question {
  question: string;
  options?: string[];
  source?: "ai" | "test";
}

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

const isMCQ = (q?: Question): q is Question =>
  !!q && Array.isArray(q.options);


export default function UniversalInterviewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ---------- CLIENT GUARD ---------- */
  const [isClient, setIsClient] = useState(false);
  const [timerReady, setTimerReady] = useState(false);

  /* ---------- QUESTIONS ---------- */
  const { data: rqQuestions, isLoading } = useActiveQuestions();

  const [finalQuestions, setFinalQuestions] = useState<Question[]>([]);

  const [testDuration, setTestDuration] = useState(0);

  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [answers, setAnswers] = useState<CandidateAnswer[]>([]);

  useEffect(() => {
    setIsClient(true);

    const duration = Number(localStorage.getItem("duration") ?? 0);
    setTestDuration(duration);
    if (duration > 0) setTimerReady(true);

    if (Array.isArray(rqQuestions) && rqQuestions.length > 0) {
      setFinalQuestions(rqQuestions);
    } else {
      const stored = localStorage.getItem("activeQuestions");
      if (stored) {
        try {
          setFinalQuestions(JSON.parse(stored));
        } catch {
          setFinalQuestions([]);
        }
      }
    }
  }, [rqQuestions]);

  const activeQuestion = finalQuestions[step];

  const isResumeTest = finalQuestions.some((q) => q.source === "ai");
  const isActiveTest = !isResumeTest;

  const { data: secondsLeft = testDuration * 60 } = useQuery({
    queryKey: ["test-timer"],
    queryFn: async () => {
      const prev = queryClient.getQueryData<number>(["test-timer"]);
      return (prev ?? testDuration * 60) - 1;
    },
    refetchInterval: 1000,
    enabled: isClient && timerReady && isActiveTest && testDuration > 0,
  });

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(INIT);
  const [dragging, setDragging] = useState(false);

  const onDrag = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dragging || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const w = ((e.clientX - rect.left) / rect.width) * 100;
      setWidth(Math.max(MIN, Math.min(MAX, w)));
    },
    [dragging]
  );

  const prevent = (e: React.ClipboardEvent<HTMLTextAreaElement>) =>
    e.preventDefault();

  useEffect(() => {
    if (!timerReady) return;
    if (!isActiveTest) return;
    if (secondsLeft <= 0) submit();
  }, [secondsLeft, timerReady, isActiveTest]);

  useEffect(() => {
    const prev = answers[step];
    setText(prev?.text ?? "");
    setCode(prev?.code ?? "");
  }, [step]);

  const save = () => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[step] = isMCQ(activeQuestion) ? { text } : { text, code };
      return copy;
    });
  };

  const next = () => {
    save();
    step < finalQuestions.length - 1 ? setStep(step + 1) : submit();
  };

  const prev = () => {
    save();
    if (step > 0) setStep(step - 1);
  };

  const evaluateMutation = useEvaluateAnswers();
  const submitMutation = useSubmitResult();

  const submit = async () => {
    const aiQ: string[] = [];
    const aiA: string[] = [];
    const fullAiAns: CandidateAnswer[] = [];
    const tq: string[] = [];
    const ta: ApiAnswer[] = [];

    finalQuestions.forEach((q, i) => {
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
        onSuccess: () =>
          router.push("/candidate/ai-test/submitted"),
      }
    );
  };

  if (isLoading)
    return <p className="p-8 text-center">Preparing questions…</p>;

  if (!activeQuestion)
    return <p className="p-8 text-center">No questions found</p>;

  const progress =
    ((step + 1) / finalQuestions.length) * 100;


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b">
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-indigo-600"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-6 py-3 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={step === 0}
            className="px-4 py-2 bg-indigo-50 rounded-lg"
          >
            <ChevronLeft />
          </button>

          {isActiveTest && (
            <div className="font-semibold text-sm">
              {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </div>
          )}

          <button
            onClick={next}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            {step === finalQuestions.length - 1 ? (
              <Send />
            ) : (
              <ChevronRight />
            )}
          </button>
        </div>

        <div className="px-6 text-center">
          <p className="text-xs text-gray-500">
            Question {step + 1} of {finalQuestions.length}
          </p>
          <h2 className="font-semibold">
            {activeQuestion.question}
          </h2>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6">
        <div
          ref={ref}
          className="flex min-h-[68vh] bg-white rounded-2xl shadow-lg overflow-hidden"
        >
          {isMCQ(activeQuestion) ? (
            <div className="w-full p-8 grid gap-3 max-w-2xl mx-auto">
              {activeQuestion.options!.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setText(opt)}
                  className={`p-4 border rounded-xl ${
                    text === opt
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-300"
                  }`}
                >
                  <CheckCircle2 />
                  {opt}
                </button>
              ))}
            </div>
          ) : (
           <>
  <div
    style={{ width: `${width}%` }}
    className="flex flex-col bg-gray-50 border-r"
  >
    <div className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold border-b">
       Your Answer
    </div>

    <textarea
      value={text}
      onChange={(e) => setText(e.target.value)}
      onPaste={prevent}
      onCopy={prevent}
      onCut={prevent}
      className="flex-1 p-5 resize-none outline-none bg-gray-50 text-gray-800 text-sm"
      placeholder="Write your answer here..."
    />
  </div>

 
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
    <div className="px-4 py-2 bg-gray-800 text-gray-200 text-sm font-semibold border-b border-gray-700">
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
