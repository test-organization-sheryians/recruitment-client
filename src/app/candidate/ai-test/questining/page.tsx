"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import type * as monaco from "monaco-editor";

// Hooks
import { useActiveQuestions } from "@/features/test/hooks/useActivation";
import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";
import { useSubmitResult } from "@/features/test/hooks/useResultTest";

import { useAntiCheat } from "@/features/test/hooks/antiCheat";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertOctagon,
  Flag,
  Clock,
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
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const attemptId =
    typeof window !== "undefined" ? localStorage.getItem("attemptId") : null;

    const testId =
  typeof window !== "undefined" ? localStorage.getItem("testId") : null;

const STORAGE_KEY = testId
  ? `testProgress:${testId}`
  : "testProgress:temp";



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


  // useAntiCheat(attemptId, () => setBlocked(true));

  const { data: rqQuestions, isLoading } = useActiveQuestions();
  const [finalQuestions, setFinalQuestions] = useState<Question[]>([]);
  const [testDuration, setTestDuration] = useState(0);

  const [step, setStep] = useState(0);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");
  const [answers, setAnswers] = useState<CandidateAnswer[]>([]);

  const [showCode, setShowCode] = useState(false); // by default HIDDEN

  // ---- LEFT SIDEBAR UI STATES ----
const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
const [savedSteps, setSavedSteps] = useState<Set<number>>(new Set());
const [reviewSteps, setReviewSteps] = useState<Set<number>>(new Set());

const [showSaveWarning, setShowSaveWarning] = useState(false);
const [pendingNav, setPendingNav] = useState<null | (() => void)>(null);

const [showInstructions, setShowInstructions] = useState(false);

const [restored, setRestored] = useState(false);

const persistProgress = useCallback((
  nextStep = step,
  nextQuestions = finalQuestions,
  nextAnswers = answers,
  nextVisited = visitedSteps,
  nextSaved = savedSteps,
  nextReview = reviewSteps
) => {
  const payload = {
    step: nextStep,
    questions: nextQuestions,
    answers: nextAnswers,
    visited: Array.from(nextVisited),
    saved: Array.from(nextSaved),
    review: Array.from(nextReview),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}, [step, finalQuestions, answers, visitedSteps, savedSteps, reviewSteps]);



  /* ---------- EFFECT: INITIAL LOAD & QUESTIONS ---------- */
 useEffect(() => {
  if (!restored) return; // 🔥 DO NOT OVERWRITE STORAGE BEFORE RESTORE

  setIsClient(true);

  const duration = Number(localStorage.getItem("duration") ?? 0);
  setTestDuration(duration);
  if (duration > 0) setTimerReady(true);

  // Only load API questions if we don't already have them
  if (Array.isArray(rqQuestions) && finalQuestions.length === 0) {
    setFinalQuestions(rqQuestions);
    persistProgress(step, rqQuestions);
    return;
  }

  // Fallback only if nothing exists
  if (finalQuestions.length > 0) return;

  const stored = localStorage.getItem("activeQuestions");
  if (!stored) return;

  try {
    const parsed = JSON.parse(stored);

    let questions: any[] = [];

    if (Array.isArray(parsed)) {
      questions = parsed;
    } else if (Array.isArray(parsed.questions)) {
      questions = parsed.questions;
    }

    if (questions.length > 0) {
      setFinalQuestions(questions);
      persistProgress(step, questions);
    }
  } catch {
    console.warn("Failed to parse activeQuestions");
  }
}, [rqQuestions, restored, finalQuestions.length, step, persistProgress]);



useEffect(() => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    setRestored(true);
    return;
  }

  try {
    const parsed = JSON.parse(stored);

    if (Array.isArray(parsed.questions)) {
      setFinalQuestions(parsed.questions);
    }

    if (Array.isArray(parsed.answers)) {
      setAnswers(parsed.answers);
    }

    if (typeof parsed.step === "number") {
      setStep(parsed.step);
    }

    if (Array.isArray(parsed.visited)) {
      setVisitedSteps(new Set(parsed.visited));
    }

    if (Array.isArray(parsed.saved)) {
      setSavedSteps(new Set(parsed.saved));
    }

    if (Array.isArray(parsed.review)) {
      setReviewSteps(new Set(parsed.review));
    }
  } catch {
    console.warn("Failed to restore test progress");
  } finally {
    setRestored(true); // 🔥 MARK RESTORE COMPLETE
  }
}, []);




  useEffect(() => {
    if (attempt?.isDisqualified) {
      setBlocked(true);
    }
  }, [attempt]);

  /* ---------- TIMER LOGIC ---------- */
  const questions = Array.isArray(finalQuestions) ? finalQuestions : [];
  const activeQuestion = Array.isArray(finalQuestions)
  ? finalQuestions[step]
  : undefined;

  const isResumeTest = questions.some(q => q.source === "ai");
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

      setIsSubmitting(false); 
      localStorage.removeItem(STORAGE_KEY);
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
          localStorage.removeItem(STORAGE_KEY);
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
  }, [step]);

  const save = () => {
  let nextAnswers: CandidateAnswer[] = [];

  setAnswers((prev) => {
    const copy = [...prev];
    copy[step] = isMCQ(activeQuestion) ? { text } : { text, code };
    nextAnswers = copy;
    return copy;
  });

  const hasAnswer = text.trim() !== "" || code.trim() !== "";

  let nextSaved = new Set<number>();
  setSavedSteps((prev) => {
    const s = new Set(prev);
    if (hasAnswer) s.add(step);
    else s.delete(step);
    nextSaved = s;
    return s;
  });

  const nextVisited = new Set(visitedSteps).add(step);

  persistProgress(
    step,
    finalQuestions,
    nextAnswers,
    nextVisited,
    nextSaved,
    reviewSteps
  );
};


 const next = () => {
  tryNavigate(() => {
    if (blocked) return;

    // Save current answer + persist state
    save();
    setShowCode(false);

    setVisitedSteps((prev) => {
      const s = new Set(prev);
      if (step + 1 < finalQuestions.length) s.add(step + 1);
      return s;
    });

    if (step < finalQuestions.length - 1) {
      const newStep = step + 1;
      setStep(newStep);
      persistProgress(newStep); // 🔥 SAVE STEP TO LOCALSTORAGE
    } else {
      onFinishClick();
    }
  });
};



// sidebar click
const jumpToQuestion = (i: number) => {
  tryNavigate(() => {
    save();
    setShowCode(false);
    setVisitedSteps((prev) => new Set(prev).add(i));
    setStep(i);
    persistProgress(i);
  });
};


// mark for review
const toggleReview = () => {
  setReviewSteps((prev) => {
    const s = new Set(prev);
    s.has(step) ? s.delete(step) : s.add(step);
    return s;
  });
};

const prev = () => {
  tryNavigate(() => {
    if (blocked) return;

    // Save current answer + persist state
    save();
    setShowCode(false);

    if (step > 0) {
      const newStep = step - 1;
      setStep(newStep);
      persistProgress(newStep); // 🔥 SAVE STEP TO LOCALSTORAGE
    }
  });
};


const isDirty = () => {
  const prev = answers[step];

  const prevText = (prev?.text ?? "").trim();
  const prevCode = (prev?.code ?? "").trim();

  const currText = text.trim();
  const currCode = code.trim();

  return prevText !== currText || prevCode !== currCode;
};


 const shouldBlockNavigation = () => {
  const dirty = isDirty();
  const isReviewed = reviewSteps.has(step);

  return dirty && !isReviewed;
};


const tryNavigate = (action: () => void) => {
  if (shouldBlockNavigation()) {
    setPendingNav(() => action);
    setShowSaveWarning(true);
    return;
  }
  action();
};


  if (isLoading || finalQuestions.length === 0) {
    return (
      <p className="p-8 text-center font-medium">
        Loading questions…
      </p>
    );
  }


const progress = ((step + 1) / finalQuestions.length) * 100;

return (
  <div className="min-h-screen flex bg-indigo-50">

    {showInstructions && (
  <div className="fixed inset-0 z-[400] bg-black/70 flex items-center justify-center">
    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl text-gray-800">

      <h2 className="text-xl font-bold mb-4 text-center text-blue-600">
        Test Instructions
      </h2>

      <div className="space-y-3 text-sm">

        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-red-500" />
          <span><b>Red:</b> Question visited but no answer saved</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-green-600" />
          <span><b>Green:</b> Answer saved successfully</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full bg-amber-500" />
          <span><b>Orange:</b> Marked for review</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="w-4 h-4 rounded-full ring-2 ring-indigo-500 rounded-full" />
          <span><b>Blue Ring:</b> Current question</span>
        </div>

        <hr className="my-3" />

        <p className="text-red-600 font-semibold">
          ⚠️ Do NOT switch tabs, minimize, or leave the test window.
          <br />
          Doing so may <b>disqualify your test automatically</b>.
        </p>

        <p className="text-gray-700">
          💾 Always <b>Save</b> or <b>Mark for Review</b> before navigating to another question.
        </p>
      </div>

      <button
        onClick={() => setShowInstructions(false)}
        className="
          mt-6
          w-full
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-semibold
          py-2
          rounded-lg
          transition-all
        "
      >
        Got It
      </button>
    </div>
  </div>
)}


    {showSaveWarning && (
  <div className="fixed inset-0 z-[250] bg-black/60 flex items-center justify-center">
    <div className="bg-white rounded-xl p-6 max-w-sm w-full text-center shadow-xl">
      <h2 className="text-lg font-bold text-gray-900 mb-2">
        Unsaved Answer
      </h2>

      <p className="text-sm text-gray-600 mb-5">
        Please <span className="font-semibold">Save</span> your answer or
        <span className="font-semibold"> Mark for Review</span> before navigating.
      </p>

      <div className="flex gap-3">
        <button
          onClick={() => {
            setShowSaveWarning(false);
            setPendingNav(null);
          }}
          className="flex-1 border rounded-lg py-2 text-sm"
        >
          Stay Here
        </button>

        <button
          onClick={() => {
            setShowSaveWarning(false);
            if (pendingNav) pendingNav();
            setPendingNav(null);
          }}
          className="flex-1 bg-blue-600 text-white rounded-lg py-2 text-sm"
        >
          Save
        </button>
      </div>
    </div>
  </div>
)}


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
                className="flex-1 bg-cyan-600 text-white rounded-lg py-2"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center">
          <div className="spinner">
            <div></div>
            <div></div>
          </div>
        </div>
      )}

{/* <div className={blocked ? "blur-md pointer-events-none select-none" : "flex flex"}> */}
{/* ================= LEFT SIDEBAR ================= */}
 <aside
  className="
    w-20
    h-screen
    bg-indigo-100
    border-r border-indigo-200
    py-6
    px-3
    flex
    flex-col
    items-center

    overflow-y-auto
    overflow-x-auto

    scrollbar-thin
    scrollbar-thumb-black
    scrollbar-track-transparent
  "
>
  {/* Attempt counter */}
  <div className="text-xs font-bold text-indigo-700 mb-6 shrink-0">
    {savedSteps.size}/{finalQuestions.length}
  </div>

  {/* Timeline */}
  <div className="relative flex flex-col items-center gap-5 pb-6 min-w-max">
    {/* Vertical connecting line */}
    <div className="absolute top-0 bottom-0 w-[2px] bg-indigo-300" />

    {finalQuestions.map((_, i) => {
      const isCurrent = i === step;
      const isReview = reviewSteps.has(i);
      const isSaved = savedSteps.has(i);
      const isVisited = visitedSteps.has(i);

      const cls = isCurrent
        ? "bg-indigo-600 text-white ring-4 ring-indigo-300"
        : isReview
        ? "bg-amber-500 text-white"
        : isSaved
        ? "bg-green-600 text-white"
        : isVisited
        ? "bg-red-500 text-white"
        : "bg-white text-gray-600 border-2 border-gray-300";

      return (
        <button
          key={i}
          onClick={() => jumpToQuestion(i)}
          className={`
            relative z-10
            w-10 h-10
            rounded-full
            flex items-center justify-center
            text-sm font-bold
            transition-all
            ${cls}
          `}
        >
          {isReview ? (
            <Flag className="w-5 h-5" />
          ) : isSaved ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            i + 1
          )}
        </button>
      );
    })}
  </div>
</aside>

    {/* ================= MAIN ================= */}
    <div className="flex-1 flex flex-col">

      {/* ===== PROGRESS BAR ===== */}
<div className="h-1 bg-blue-200">
  <div
    className="h-full bg-blue-600 transition-all duration-300"
    style={{ width: `${progress}%` }}
  />
</div>

{/* ===== TIMER HEADER ===== */}
<div className="bg-blue-100 px-4 py-3 flex items-center justify-between border-b border-blue-200">
  
  {/* Instructions Button */}
  <button
    onClick={() => setShowInstructions(true)}
    className="
      px-4 py-1.5
      text-sm
      font-semibold
      rounded-lg
      bg-white
      text-blue-600
      border border-blue-300
      hover:bg-blue-50
      transition-all
    "
  >
    Instructions
  </button>

  {/* TIMER */}
  {isActiveTest && (
    <div className="flex items-center gap-2">
      <Clock className="w-5 h-5 text-gray-700" />
      <div className="text-lg font-semibold text-gray-900">
        {Math.floor(secondsLeft / 60)}:
        {String(secondsLeft % 60).padStart(2, "0")}
      </div>
    </div>
  )}

  <div className="w-[100px]" />
</div>



{/* ===== QUESTION HEADER ===== */}
<div className="bg-white border-b border-gray-200">
  <div className="text-center py-3">
    <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">
      Question {step + 1} of {finalQuestions.length}
    </div>

    <h2 className="text-xl font-semibold text-gray-900 px-4">
      {activeQuestion?.question}

    </h2>
  </div>

  <div className="px-4 pb-3 flex items-center justify-between">
    <div className="text-sm text-gray-600">
      <span className="font-semibold text-blue-600">
        {savedSteps.size}
      </span>{" "}
      answered •{" "}
      <span className="font-semibold text-gray-500">
        {finalQuestions.length - savedSteps.size}
      </span>{" "}
      remaining
    </div>

    <button
      onClick={toggleReview}
      className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
        reviewSteps.has(step)
          ? "bg-blue-600 text-white hover:bg-blue-700"
          : "bg-white text-blue-600 border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50"
      }`}
    >
      <Flag className="w-4 h-4" />
      {reviewSteps.has(step) ? "Marked for Review" : "Mark for Review"}
    </button>
  </div>
</div>


  {/* ================= MAIN CONTENT AREA ================= */}
<div className="bg-blue-50 flex-1 overflow-hidden flex flex-col">
  <div className="flex-1 p-4 overflow-auto">


   {isMCQ(activeQuestion) ? (
      /* ================= MCQ UI ================= */
      <div className="w-full max-w-2xl mx-auto grid gap-4">
        {activeQuestion.options!.map((opt, i) => (
          <button
            key={i}
            onClick={() => setText(opt)}
            className={`
              p-4 rounded-lg border-2 text-left transition-all
              ${text === opt
                ? "border-blue-600 bg-blue-50"
                : "border-gray-200 hover:border-blue-300"}
            `}
          >
            <div className="flex items-center gap-3">
              <CheckCircle2
                className={`w-5 h-5 ${
                  text === opt ? "text-blue-600" : "text-gray-300"
                }`}
              />
              <span className="font-medium text-gray-800">{opt}</span>
            </div>
          </button>
        ))}
      </div>
    ):(
    <div
      className="grid gap-4 h-full"
      style={{ gridTemplateColumns: showCode ? "1fr 1fr" : "1fr" }}
    >
      {/* ===== EXPLANATION ===== */}
      <div className="bg-blue-50 rounded-lg shadow-sm p-4 flex flex-col border border-blue-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wide">
            Explanation
          </h3>

          {!showCode && (
            <button
              onClick={() => setShowCode(true)}
              className="
                text-xs
                font-semibold
                text-white
                bg-blue-600
                hover:bg-blue-700
                px-3 py-2
                rounded
                transition-colors
              "
            >
              Show Code
            </button>
          )}
        </div>

        <textarea
  value={text}
  onChange={(e) => setText(e.target.value)}
  onPaste={prevent}
  onCopy={prevent}
  onCut={prevent}
  placeholder="Explain your answer here..."
  className="
    flex-1
    w-full
    p-3
    bg-white
    border
    border-blue-200
    rounded
    resize-none
    text-black
    font-semibold
    focus:outline-none
    focus:ring-2
    focus:ring-blue-500
  "
/>

      </div>

      {/* ===== CODE EDITOR ===== */}
      {showCode && (
  <div className="bg-[#1e1e1e] rounded-xl shadow-lg flex flex-col border border-[#2d2d2d] overflow-hidden">
    
    {/* HEADER */}
    <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
      <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">
        Code Editor
      </h3>

      <button
        onClick={() => setShowCode(false)}
        className="
          text-xs
          font-semibold
          text-white
          bg-blue-600
          hover:bg-blue-700
          px-3 py-1
          rounded
          transition-colors
        "
      >
        Hide Code
      </button>
    </div>

    {/* EDITOR */}
    <div className="flex-1">
      <Editor
        height="100%"
        defaultLanguage="javascript"
        value={code}
        theme="vs-dark"
        onMount={(editor) => {
          editorRef.current = editor;
          editor.focus();
        }}
        onChange={(v) => setCode(v ?? "")}
        options={{
          fontSize: 15,
          fontFamily: "Fira Code, monospace",
          lineHeight: 22,

          minimap: { enabled: false },
          automaticLayout: true,

          scrollBeyondLastLine: false,
          smoothScrolling: true,

          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",

          wordWrap: "on",
          tabSize: 2,

          padding: {
            top: 12,
            bottom: 12,
          },

          renderLineHighlight: "all",
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  </div>
)}

    </div>
    )}
  </div>

  {/* ================= FOOTER ================= */}
  <div className="px-4 pb-4 pt-2 flex justify-between items-center bg-blue-50">
    <button
      onClick={prev}
      disabled={step === 0}
      className="
        px-6 py-2
        bg-blue-600
        hover:bg-blue-700
        text-white
        font-semibold
        rounded-lg
        shadow-md
        transition-all
        disabled:opacity-30
        disabled:cursor-not-allowed
        flex items-center gap-2
      "
    >
      <ChevronLeft className="w-4 h-4" />
      Back
    </button>

    <div className="flex items-center gap-3">
      <button
        onClick={save}
        className="
          px-6 py-2
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-semibold
          rounded-lg
          shadow-md
          transition-all
        "
      >
        Save
      </button>

      <button
        onClick={next}
        className="
          px-6 py-2
          bg-blue-600
          hover:bg-blue-700
          text-white
          font-semibold
          rounded-lg
          shadow-md
          transition-all
          flex items-center gap-2
        "
      >
        {step === finalQuestions.length - 1 ? "Submit Test" : "Next"}
        {step < finalQuestions.length - 1 && (
          <ChevronRight className="w-4 h-4" />
        )}
      </button>
    </div>
  </div>
</div>


    </div>
    </div>
);
}