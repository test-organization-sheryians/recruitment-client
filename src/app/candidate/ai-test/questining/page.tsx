"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// Hooks
import { useActiveQuestions } from "@/features/test/hooks/useActivation";
import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";
import { useSubmitResult } from "@/features/test/hooks/useResultTest";

import { useAntiCheat } from "@/features/test/hooks/antiCheat";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  GripVertical,
  AlertOctagon,
} from "lucide-react";

// Monaco Editor (Client-side only)
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

/* ---------- INTERFACES ---------- */
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

const isMCQ = (q?: Question): q is Question => !!q && Array.isArray(q.options);


export default function UniversalInterviewPage() {
  const attemptId =
    typeof window !== "undefined" ? localStorage.getItem("attemptId") : null;

  const { data: attempt } = useQuery({
    queryKey: ["attempt", attemptId],
    enabled: !!attemptId,
    queryFn: async () => {
      const res = await fetch(`/api/test-attempts/${attemptId}`, {
        credentials: "include",
      });
      return res.json();
    },
  });


  const router = useRouter();
  const queryClient = useQueryClient();

  /* ---------- API MUTATIONS ---------- */
  const evaluateMutation = useEvaluateAnswers();
  const submitMutation = useSubmitResult();

  /* ---------- STATE ---------- */
  const [isClient, setIsClient] = useState(false);
  const [timerReady, setTimerReady] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  useAntiCheat(attemptId, () => setBlocked(true));

  const { data: rqQuestions, isLoading } = useActiveQuestions();
  const [finalQuestions, setFinalQuestions] = useState<Question[]>([]);
  const [testDuration, setTestDuration] = useState(0);

  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [answers, setAnswers] = useState<CandidateAnswer[]>([]);

  /* ---------- EFFECT: INITIAL LOAD & QUESTIONS ---------- */
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

  useEffect(() => {
    if (attempt?.isDisqualified) {
      setBlocked(true);
    }
  }, [attempt]);

  /* ---------- TIMER LOGIC ---------- */
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
    enabled: isClient && timerReady && isActiveTest && testDuration > 0 && !blocked,
  });

  /* ---------- UI HANDLERS ---------- */
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

  const prevent = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();

  const submitTest = useCallback(async () => {
    if (blocked) return;

    const finalAnswers = [...answers];
    finalAnswers[step] = isMCQ(activeQuestion) ? { text } : { text, code };

    const aiQ: string[] = [];
    const aiA: string[] = [];
    const fullAiAns: CandidateAnswer[] = [];
    const tq: string[] = [];
    const ta: ApiAnswer[] = [];

    finalQuestions.forEach((q, i) => {
      const ans = finalAnswers[i] || {};
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

      setIsSubmitting(false); // ✅ ADD HERE
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
        onSuccess: () => {
          setIsSubmitting(false); 
          router.push("/candidate/ai-test/submitted");
        },
        onError: () => {
          setIsSubmitting(false); 
        },
      }
    );
  }, [
    blocked,
    answers,
    step,
    text,
    code,
    activeQuestion,
    finalQuestions,
    evaluateMutation,
    submitMutation,
    router,
    secondsLeft,
    testDuration,
  ]);

  const onFinishClick = () => {
    if (blocked || isSubmitting) return;
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    await submitTest();
  };



  useEffect(() => {
    if (blocked) {
      sessionStorage.setItem("disqualified", "true");

      console.log("Anti-cheat triggered: Test Locked.");
    }

    if (timerReady && isActiveTest && secondsLeft <= 0) {
      submitTest();
    }
  }, [secondsLeft, timerReady, isActiveTest, blocked, submitTest]);

  useEffect(() => {
    const prev = answers[step];
    setText(prev?.text ?? "");
    setCode(prev?.code ?? "");
  }, [step, answers]);

  const save = () => {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[step] = isMCQ(activeQuestion) ? { text } : { text, code };
      return copy;
    });
  };

  const next = () => {
    if (blocked) return;
    save();
    step < finalQuestions.length - 1 ? setStep(step + 1) : onFinishClick();
  };

  const prev = () => {
    save();
    if (step > 0) setStep(step - 1);
  };

  if (isLoading) return <p className="p-8 text-center font-medium">Preparing questions…</p>;
  if (!activeQuestion) return <p className="p-8 text-center font-medium">No questions found</p>;

  const progress = ((step + 1) / finalQuestions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">

      {/* 1. DISQUALIFIED OVERLAY */}
      {blocked && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl ring-1 ring-black/10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertOctagon className="h-9 w-9 text-red-600" />
            </div>

            <h2 className="mb-2 text-2xl font-extrabold tracking-wide text-red-600">
              TEST TERMINATED
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-gray-600">
              Activity violation detected <span className="font-semibold">(multiple tab switches)</span>.
              Your test has been locked and reported.
            </p>

            <button
              onClick={() => {
                sessionStorage.setItem("disqualified", "true");
                router.push("/");
              }}
              className="
        w-full rounded-lg bg-red-600 py-3 text-sm font-bold text-white
        shadow-md transition
        hover:bg-red-700
        active:scale-95
        focus:outline-none focus:ring-4 focus:ring-red-300
      "
            >
              RETURN TO HOME
            </button>
          </div>
        </div>

      )}

      {/* 2. SUBMIT CONFIRM MODAL */}
      {showConfirm && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-bold mb-2">Submit Test?</h2>
            <p className="text-gray-600 mb-6">
              You won’t be able to change answers after this.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 border rounded-lg py-2"
              >
                Cancel
              </button>

              <button
                onClick={confirmSubmit}
                className="flex-1 bg-red-600 text-white rounded-lg py-2"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-white border-t-transparent" />
        </div>
      )}


      {/* 2. MAIN TEST CONTENT */}
      <div className={blocked ? "blur-md pointer-events-none select-none" : ""}>
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b">
          <div className="h-1 bg-gray-200">
            <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>

          <div className="px-6 py-3 flex items-center justify-between">
            <button
              onClick={prev}
              disabled={step === 0}
              className="p-2 bg-indigo-50 rounded-lg disabled:opacity-30 transition-opacity"
            >
              <ChevronLeft className="w-6 h-6 text-indigo-600" />
            </button>

            {isActiveTest && (
              <div className={`font-mono font-bold text-lg ${secondsLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
                {Math.floor(secondsLeft / 60)}:{String(secondsLeft % 60).padStart(2, "0")}
              </div>
            )}

            <button
              onClick={
                step === finalQuestions.length - 1
                  ? onFinishClick
                  : next
              }

              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              {step === finalQuestions.length - 1 ? <><Send className="w-4 h-4" /> Finish</> : <ChevronRight className="w-6 h-6" />}
            </button>
          </div>

          <div className="px-6 pb-4 text-center">
            <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-1">Question {step + 1} of {finalQuestions.length}</p>
            <h2 className="text-xl font-bold text-gray-800 leading-tight">{activeQuestion.question}</h2>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6">
          <div ref={ref} className="flex min-h-[65vh] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            {isMCQ(activeQuestion) ? (
              <div className="w-full p-10 grid gap-4 max-w-2xl mx-auto items-center">
                {activeQuestion.options!.map((opt, i) => (
                  <button
                    key={i}
                    disabled={blocked}
                    onClick={() => setText(opt)}
                    className={`p-5 border-2 rounded-xl flex items-center gap-4 transition-all text-left ${text === opt ? "border-indigo-600 bg-indigo-50 shadow-inner" : "border-gray-100 hover:border-indigo-200"
                      }`}
                  >
                    <CheckCircle2 className={`w-6 h-6 ${text === opt ? "text-indigo-600" : "text-gray-200"}`} />
                    <span className={`font-semibold ${text === opt ? "text-indigo-800" : "text-gray-600"}`}>{opt}</span>
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div style={{ width: `${width}%` }} className="flex flex-col bg-gray-50 border-r border-gray-200">
                  <div className="px-4 py-2 bg-gray-100 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b">Explanation Area</div>
                  <textarea
                    value={text}
                    disabled={blocked}
                    onChange={(e) => {
                      if (blocked) return;
                      setText(e.target.value);
                    }}
                    onPaste={prevent}
                    onCopy={prevent}
                    className="flex-1 p-6 resize-none outline-none bg-transparent text-gray-700 text-lg leading-relaxed font-medium"
                    placeholder="Write your explanation or logic here..."
                  />
                </div>

                <div
                  className="w-1.5 bg-gray-100 hover:bg-indigo-400 cursor-col-resize flex items-center justify-center transition-colors"
                  onMouseDown={() => setDragging(true)}
                  onMouseUp={() => setDragging(false)}
                  onMouseMove={onDrag}
                >
                  <GripVertical className="text-gray-300 w-4" />
                </div>

                <div style={{ width: `${100 - width}%` }} className="flex flex-col bg-[#1e1e1e]">
                  <div className="px-4 py-2 bg-[#252526] text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-[#333]">Monaco Code Editor</div>
                  <div className="flex-1 overflow-hidden">
                    <Editor
                      height="100%"
                      defaultLanguage="javascript"
                      value={code}
                      theme="vs-dark"
                      onChange={(v) => {
                        if (blocked) return;
                        setCode(v ?? "");
                      }}
                      options={{
                        readOnly: blocked,
                        fontSize: 16,
                        minimap: { enabled: false },
                        contextmenu: false,
                        automaticLayout: true,
                        lineNumbers: "on",
                        padding: { top: 20 }
                      }}
                      onMount={(editor, monaco) => {
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, () => { });
                        editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, () => { });
                      }}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}