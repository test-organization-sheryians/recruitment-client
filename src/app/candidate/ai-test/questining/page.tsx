"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import type * as monaco from "monaco-editor";

// Hooks
import { useTestInfo } from "@/features/test/hooks/testInfo";
import { useActiveQuestions } from "@/features/test/hooks/useActivation";
import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";
import { useSubmitResult } from "@/features/test/hooks/useResultTest";
import { useAnswers } from "@/features/test/hooks/useAnswers";
import { useTestTimer } from "@/features/test/hooks/useTimer";
import { useTestSubmission } from "@/features/test/hooks/useTestSubmission";
import { usePreventNavigation } from "@/features/test/hooks/usePreventNavigation";
import { useTestPersistence } from "@/features/test/hooks/useTestPersistence";
import { useSplitEditor } from "@/features/test/hooks/useSplitEditor";
import { useAntiCheat } from "@/features/test/hooks/antiCheat";
import { enableDevToolsGuard, enforceFullScreen } from '@/lib/devtoolsAndScreenGuard'

// Icons
import { ChevronLeft, ChevronRight, CheckCircle2, Flag, Clock, } from "lucide-react";
import TestInstructionsModal from "@/features/test/components/TestInstruct";
import SaveWarningModal from "@/features/test/components/SaveWarning";
import TestTerminatedModal from "@/features/test/components/TestTermination";
import SubmitConfirmModal from "@/features/test/components/SubmitWarning";

// Monaco Editor (Client-side only)
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
});

const INITIAL_STATE = {
  step: 0,
  questions: [],
  answers: [],
  visited: [],
  saved: [],
  review: [],
};

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

const isMCQ = (q?: Question): q is Question => !!q && Array.isArray(q.options);

export default function UniversalInterviewPage() {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const attemptId =
    typeof window !== "undefined" ? localStorage.getItem("attemptId") : null;
  const params = useParams();


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

  /* ---------- API MUTATIONS ---------- */
  const evaluateMutation = useEvaluateAnswers();
  const submitMutation = useSubmitResult();
  const { data: rqQuestions, refetch } = useActiveQuestions();
  const { containerRef, width, startDrag } = useSplitEditor();

  const STORAGE_KEY =
    typeof window !== "undefined"
      ? `testProgress:${localStorage.getItem("testId") ?? "temp"}`
      : "testProgress:temp";

  const testId = params?.testId as string;

  const { restored, state, persist, } = useTestPersistence<Question, CandidateAnswer>(STORAGE_KEY, INITIAL_STATE);



  const step = state.step;
  const savedQuestions = state.questions;
  const visitedSteps = new Set(state.visited);
  const savedSteps = new Set(state.saved);
  const reviewSteps = new Set(state.review);
  const activeQuestion = savedQuestions[step] ?? null;
  const initializedRef = useRef(false);

  useEffect(() => {
    const cleanup = enableDevToolsGuard();
    const fullScreen = enforceFullScreen()
    return () => {
      cleanup?.();
      fullScreen?.();
    };
  }, [])

  useEffect(() => {
    if (!restored) return;
    if (!rqQuestions?.length) return;
    if (initializedRef.current) return;
    if (state.questions.length > 0) return; 

    initializedRef.current = true;

    persist({
      questions: rqQuestions,
      visited: [0],
      step: 0,
    });
  }, [restored, rqQuestions, state.questions.length]);




  /* ---------- STATE ---------- */
  const [blocked, setBlocked] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const secondsLeftRef = useRef(0);
  useAntiCheat(attemptId, () => {
    setBlocked(true);
    submitTest()
  });
  const [testDuration, setTestDuration] = useState(0);
  const finalQuestions = state.questions;
  const { text, setText, code, setCode, isDirty, } = useAnswers(activeQuestion, step, state.answers);
  const [showCode, setShowCode] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);


  const { data: test } = useTestInfo(testId);
  useEffect(() => {

    const duration = Number(localStorage.getItem("duration"));
    if (duration > 0) {
      setTestDuration(duration);
    }
  }, []);
  useEffect(() => {
    const rawDuration = localStorage.getItem("duration");
    const storedDuration = Number(rawDuration);

    if (rawDuration && !isNaN(storedDuration) && storedDuration > 0) {
      setTestDuration(storedDuration);
    } 
  }, [attempt]);
  /* ---------- TIMER LOGIC ---------- */
  const questions = Array.isArray(finalQuestions) ? finalQuestions : [];
  const isResumeTest = questions.some(q => q.source === "ai");
  const isActiveTest = !isResumeTest;

  const secondsLeft = useTestTimer(
    testDuration,
    isActiveTest && !blocked && testDuration > 0,
    () => submitTest()
  );

  const { submitTest } = useTestSubmission({
    questions: finalQuestions,
    answers: state.answers,
    blocked,
    secondsLeft: secondsLeft,
    testDuration,
    evaluateMutation,
    submitMutation,
    setIsSubmitting,
  });

  useEffect(() => {
    secondsLeftRef.current = secondsLeft;
  }, [secondsLeft]);

  const prevent = (e: React.ClipboardEvent<HTMLTextAreaElement>) => e.preventDefault();

  const onFinishClick = () => {
    if (blocked || isSubmitting) return;
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    localStorage.removeItem("test_deadline_timestamp");
    await submitTest();
  };

  useEffect(() => {
    if (blocked) {
      sessionStorage.setItem("disqualified", "true");
      console.log("Anti-cheat triggered: Test Locked.");
    }
  }, [secondsLeft, isActiveTest, blocked, submitTest]);

  const { tryNavigate, showSaveWarning, pendingNav, clearWarning, confirmAndNavigate, } = usePreventNavigation({
    isDirty,
    isReviewed: reviewSteps.has(step),
  });

  const next = () => {
    tryNavigate(() => {
      if (blocked) return;
      onSave();
      setShowCode(false);
      if (step < finalQuestions.length - 1) {
        persist({ step: step + 1 });
      } else {
        onFinishClick();
      }
    });
  };
  // sidebar click
  const jumpToQuestion = (i: number) => {
    tryNavigate(() => {
      onSave();
      setShowCode(false);
      persist({ step: i });
    });
  };

  // mark for review
  const toggleReview = () => {
    const review = new Set(state.review);
    review.has(step) ? review.delete(step) : review.add(step);
    persist({ review: [...review] });
  };

  const prev = () => {
    tryNavigate(() => {
      if (blocked) return;
      onSave();
      setShowCode(false);
      if (step > 0) persist({ step: step - 1 });
    });
  };

  const onSave = () => {
    const nextAnswers = [...state.answers];
    nextAnswers[step] = isMCQ(activeQuestion)
      ? { text }
      : { text, code };
    const hasAnswer = text.trim() || code.trim();
    const saved = new Set(state.saved);
    hasAnswer ? saved.add(step) : saved.delete(step);
    const visited = new Set(state.visited);
    visited.add(step);
    persist({
      answers: nextAnswers,
      saved: [...saved],
      visited: [...visited],
    });
  };

  const progress =
    finalQuestions.length === 0
      ? 0
      : ((step + 1) / finalQuestions.length) * 100;

  return (
    <div className="min-h-screen flex bg-indigo-50">
      {showInstructions && (<TestInstructionsModal onClose={() => setShowInstructions(false)} />)}

      {showSaveWarning && (<SaveWarningModal onStay={clearWarning} onSaveAndNavigate={() => {
        onSave();
        confirmAndNavigate();
      }} />)}

      {/* 1. DISQUALIFIED OVERLAY */}
      {blocked && (<TestTerminatedModal />)}

      {/* 2. SUBMIT CONFIRM MODAL */}
      {showConfirm && (<SubmitConfirmModal
        onCancel={() => setShowConfirm(false)}
        onConfirm={confirmSubmit} />)}

      {isSubmitting && (
        <div className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center">
          <div className="spinner">
            <div></div>
            <div></div>
          </div>
        </div>
      )}

      {/* ================= LEFT SIDEBAR ================= */}
      <aside className="w-20 h-screen bg-indigo-100 border-r border-indigo-200 py-6 px-3 flex flex-col items-center overflow-y-auto overflow-x-auto scrollbar-thin scrollbar-thumb-black scrollbar-track-transparent">
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
              <button key={i} onClick={() => jumpToQuestion(i)} className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${cls}`}>
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
            onClick={() => setShowInstructions(true)} className="px-4 py-1.5 text-sm font-semibold rounded-lg bg-white text-blue-600 border border-blue-300 hover:bg-blue-50 transition-all">
            Instructions
          </button>
          {/* TIMER */}
          {/* {testDuration > 0 ? (
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-700" />
              <div className="text-lg font-semibold text-gray-900">
                {Math.floor(secondsLeft / 60)}:
                {String(secondsLeft % 60).padStart(2, "0")}
              </div>
            </div>
          ) : (
            <div className="text-xs text-gray-400">Loading Timer...</div>
          )} */}
          {secondsLeft > 0 ? (
            <div className="text-lg font-semibold">
              {Math.floor(secondsLeft / 60)}:
              {String(secondsLeft % 60).padStart(2, "0")}
            </div>
          ) : (
            <span className="text-xs text-gray-400">Loading timer…</span>
          )}

          <div className="w-[100px]" />
        </div>

        {/* ===== QUESTION HEADER ===== */}
        <div className="bg-white border-b border-gray-200">
          <div className="text-center py-3">
            <div className="text-xs font-semibold text-blue-600 mb-1 uppercase tracking-wide">
              Question {step + 1} of {finalQuestions.length}
            </div>
            <h2 className="text-xl font-semibold text-gray-900 px-4 select-none">
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
              onClick={toggleReview} className={`px-4 py-1.5 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${reviewSteps.has(step)
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white text-blue-600 border-2 border-blue-300 hover:border-blue-400 hover:bg-blue-50"
                }`}>
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
                {activeQuestion.options!.map((opt, i) => (<button key={i} onClick={() => setText(opt)} className={`p-4 rounded-lg border-2 text-left transition-all${text === opt
                  ? "border-blue-600 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"}`}>
                  <div className="flex items-center gap-3">
                    <CheckCircle2
                      className={`w-5 h-5 ${text === opt ? "text-blue-600" : "text-gray-300"
                        }`} />
                    <span className="font-medium text-gray-800">{opt}</span>
                  </div>
                </button>
                ))}
              </div>
            ) : (
              <div
                ref={containerRef}
                className="flex h-full gap-2"
              >
                {/* ===== EXPLANATION ===== */}
                <div
                  style={{ width: showCode ? `${width}%` : "100%" }}
                  className="bg-blue-50 rounded-lg shadow-sm p-4 flex flex-col border border-blue-100 transition-all">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wide">Explanation</h3>
                    {!showCode && (
                      <button
                        onClick={() => setShowCode(true)} className="text-xs font-semibold text-blue-600 hover:underline">Show Code</button>)}
                  </div>

                  <textarea value={text} onChange={(e) => setText(e.target.value)} onPaste={prevent} onCopy={prevent} onCut={prevent} placeholder="Explain your answer here..." className="flex-1 w-full p-3 bg-white border border-blue-200 rounded resize-none text-black font-semibold focus:outline-none focus:ring-2 focus:ring-blue-50 " />
                </div>
                {showCode && (
                  <div onMouseDown={startDrag} className="w-1 cursor-col-resize bg-blue-300 hover:bg-blue-500" />)}

                {/* ===== CODE EDITOR ===== */}
                {showCode && (
                  <div className="flex-1 bg-[#1e1e1e] rounded-xl shadow-lg flex flex-col border border-[#2d2d2d] overflow-hidden">
                    {/* HEADER */}
                    <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#333]">
                      <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider"> Code Editor</h3>
                      <button onClick={() => setShowCode(false)} className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded transition-colors ">
                        Hide Code</button>
                    </div>
                    {/* EDITOR */}
                    <div className="flex-1"
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => e.preventDefault()}>
                      <Editor
                        height="100%" defaultLanguage="javascript" value={code} theme="vs-dark"
                        onMount={(editor, monaco) => {
                          editorRef.current = editor;
                          editor.focus();
                          // ----- BLOCK KEYBOARD SHORTCUTS ----- //
                          const block = () => null;
                          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyC, block);
                          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyV, block);
                          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyX, block);
                          editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyA, block);
                          // ----- DISABLE SELECTION DRAGGING ----- //
                          editor.updateOptions({
                            dragAndDrop: false,
                            selectionClipboard: false,
                          });
                          editor.onMouseDown((e) => {
                            if (e.event.leftButton) {
                              e.event.preventDefault();
                              e.event.stopPropagation();
                            }
                          });
                          // ----- BLOCK DOM EVENTS ----- //
                          const domNode = editor.getDomNode();
                          if (!domNode) return;
                          const prevent = (e: Event) => {
                            e.preventDefault();
                            e.stopPropagation();
                          };
                          ["copy", "paste", "cut", "dragstart", "drop"].forEach(ev =>
                            domNode.addEventListener(ev, prevent, true));
                          editor.onDidDispose(() => {
                            ["copy", "paste", "cut", "dragstart", "drop"].forEach(ev =>
                              domNode.removeEventListener(ev, prevent, true));
                          });
                        }}
                        onChange={(v) => setCode(v ?? "")}
                        options={{
                          dragAndDrop: false,
                          fontSize: 15, fontFamily: "Fira Code, monospace", lineHeight: 22, contextmenu: false, quickSuggestions: false,
                          minimap: { enabled: false }, automaticLayout: true, scrollBeyondLastLine: false, smoothScrolling: true, cursorBlinking: "smooth", cursorSmoothCaretAnimation: "on", wordWrap: "on", tabSize: 2, padding: { top: 12, bottom: 12 }, renderLineHighlight: "all", scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8, },
                        }} />
                    </div>
                  </div>)}
              </div>)}
          </div>
          {/* ================= FOOTER ================= */}
          <div className="px-4 pb-4 pt-2 flex justify-between items-center bg-blue-50">
            <button onClick={prev} disabled={step === 0} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />Back</button>
            <div className="flex items-center gap-3">
              <button onClick={onSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all">Save</button>
              <button onClick={next} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all flex items-center gap-2 ">
                {step === finalQuestions.length - 1 ? "Submit Test" : "Next"}
                {step < finalQuestions.length - 1 && (<ChevronRight className="w-4 h-4" />)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}