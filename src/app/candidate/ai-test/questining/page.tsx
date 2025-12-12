// pages/app/candidate/ai-test/questining/page or your path
"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useActiveQuestions } from "@/features/AITest/hooks/useActivation";
import { useSubmitResult } from "@/features/AITest/hooks/useResultTest";

import Editor from "@monaco-editor/react";
import { KeyMod, KeyCode } from "monaco-editor";
import {
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  Circle,
  Code,
  GripVertical,
} from "lucide-react";

import { useState, useCallback, useRef, useEffect } from "react";

const MIN = 25;
const MAX = 75;
const INIT = 50;

export default function UniversalInterviewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useActiveQuestions();
  const submitMutation = useSubmitResult();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(INIT);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (questions.length > 0 && answers.length !== questions.length) {
      setAnswers(Array(questions.length).fill(""));
    }
  }, [questions]);

  const current = questions[step];
  const isMCQ = Array.isArray(current?.options);
  const progress = questions.length ? ((step + 1) / questions.length) * 100 : 0;

  const prevent = useCallback((e: any) => e.preventDefault(), []);
  const keyBlock = useCallback((e: any) => {
    if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key)) {
      e.preventDefault();
    }
  }, []);

  const startDrag = () => {
    setDragging(true);
    document.body.style.cursor = "col-resize";
  };
  const stopDrag = () => {
    setDragging(false);
    document.body.style.cursor = "default";
  };
  const onDrag = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const w = ((e.clientX - rect.left) / rect.width) * 100;
      setWidth(Math.max(MIN, Math.min(MAX, w)));
    },
    [dragging]
  );

  useEffect(() => {
    if (!dragging) return;
    document.addEventListener("mousemove", onDrag);
    document.addEventListener("mouseup", stopDrag);
    return () => {
      document.removeEventListener("mousemove", onDrag);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [dragging, onDrag]);

  const save = () => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[step] = isMCQ ? text : { text, code };
      return updated;
    });
  };

  const next = () => {
    save();
    if (step < questions.length - 1) {
      setStep(step + 1);
      const nextAnswer = answers[step + 1];
      if (typeof nextAnswer === "object") {
        setText(nextAnswer.text || "");
        setCode(nextAnswer.code || "");
      } else {
        setText(nextAnswer || "");
        setCode("");
      }
    } else {
      submit();
    }
  };

  const prev = () => {
    save();
    if (step > 0) {
      const prevStep = step - 1;
      const prevAnswer = answers[prevStep];
      setStep(prevStep);
      if (typeof prevAnswer === "object") {
        setText(prevAnswer.text || "");
        setCode(prevAnswer.code || "");
      } else {
        setText(prevAnswer || "");
        setCode("");
      }
    }
  };

 /** SUBMIT LOGIC FOR BOTH FLOWS */
const submit = async () => {
  const attemptId = localStorage.getItem("attemptId");
  const testId = localStorage.getItem("testId");
  const email = localStorage.getItem("email");
  const startTime = localStorage.getItem("startTime");
  const endTime = new Date().toISOString();

  const aiQuestions: string[] = [];
  const aiAnswers: any[] = [];

  const testQuestions: string[] = [];
  const testAnswers: any[] = [];

  // Split by source
  questions.forEach((q: any, index: number) => {
    if (q.source === "ai") {
      aiQuestions.push(q.question);
      aiAnswers.push(answers[index]);
    } else {
      testQuestions.push(q.question);
      testAnswers.push(answers[index]);
    }
  });

  /** =====================================
   *  FLOW 1 — RESUME QUESTIONS → EVALUATION API
   * ===================================== */
  if (aiQuestions.length > 0) {
    try {
      const evaluation = await evaluateMutation.mutateAsync({
        questions: aiQuestions,
        answers: aiAnswers,
      });

      sessionStorage.setItem(
        "resumeResult",
        JSON.stringify({
          questions: aiQuestions,
          answers: aiAnswers,
          score: evaluation.score,
          percentage: evaluation.percentage,
        })
      );

      return router.push("/candidate/ai-test/result");
    } catch (err) {
      console.error("Evaluation failed:", err);
    }
  }

  /** =====================================
   *  FLOW 2 — TEST QUESTIONS → SUBMIT TEST API
   * ===================================== */
  if (testId && testQuestions.length > 0) {
    submitMutation.mutate(
      {
        attemptId,
        testId,
        email,
        questions: testQuestions,
        answers: testAnswers,
        score: 0,
        percentage: 0,
        isPassed: false,
        status: "Submitted",
        startTime,
        endTime,
        durationTaken: 0,
      },
      {
        onSuccess: () => router.push("/candidate/ai-test/submitted"),
      }
    );
  }
};


  const editorMount = (editor: any) => {
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
    editor.updateOptions({ contextmenu: false });
    editor.getDomNode()?.addEventListener("paste", prevent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E7E9F1] to-white flex flex-col">
      {isLoading && <p className="p-6 text-center">Preparing questions…</p>}
      {!isLoading && !questions.length && <p className="p-6 text-center">No questions found.</p>}

      {questions.length > 0 && (
        <>
          <div className="sticky top-0 bg-white border-b shadow-sm z-50">
            <div className="h-1 bg-gray-200">
              <div className="h-full bg-gradient-to-r from-[#1E47FF] to-[#61A0FF]" style={{ width: `${progress}%` }} />
            </div>

            <div className="relative px-6 py-3 flex items-center justify-between">
              <button onClick={prev} disabled={step === 0} className="w-10 h-10 rounded-full bg-white border disabled:opacity-50 flex items-center justify-center">
                <ChevronLeft />
              </button>

              <h2 className="absolute left-1/2 -translate-x-1/2 font-semibold text-center max-w-4xl">Q{step + 1}. {current.question}</h2>

              <button onClick={next} className="text-white bg-[#1E47FF] hover:bg-[#375FFF] px-5 py-2 rounded-lg">
                {step === questions.length - 1 ? <><Send className="mr-1" /> Submit</> : <ChevronRight />}
              </button>
            </div>
          </div>

          <div className="flex-1 p-6 max-w-8xl mx-auto w-full">
            <div ref={ref} className="bg-white shadow-lg border rounded-xl min-h-[70vh] flex">
              {isMCQ ? (
                <div className="p-10 flex w-full justify-center">
                  <div className="space-y-4 max-w-xl w-full">
                    {current.options?.map((opt: string, i: number) => (
                      <label key={i} onClick={() => setText(opt)} className={`block p-4 pl-12 rounded-xl border cursor-pointer relative ${ text === opt ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/50" : "border-gray-200 hover:bg-blue-50" }`}>
                        <div className="absolute left-4 top-1/2 -translate-y-1/2">{text === opt ? <CheckCircle2 /> : <Circle />}</div>
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ width: `${width}%` }} className="flex flex-col border-r">
                    <h3 className="p-4 font-semibold">Explain Logic</h3>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onPaste={prevent}
                      onCopy={prevent}
                      onCut={prevent}
                      onKeyDown={keyBlock}
                      className="flex-1 p-6 outline-none"
                      placeholder="Explain your thought process…"
                    />
                  </div>

                  <div className="w-2 bg-gray-200 hover:bg-blue-500 cursor-col-resize relative" onMouseDown={startDrag}>
                    <GripVertical className="text-gray-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>

                  <div style={{ width: `${100 - width}%` }} className="flex flex-col bg-gray-900">
                    <h3 className="p-4 border-b border-gray-700 text-white flex items-center gap-2"><Code className="text-blue-400" /> Code</h3>

                    <Editor height="100%" defaultLanguage="javascript" value={code} onChange={(v) => setCode(v || "")} theme="vs-dark" onMount={editorMount} options={{ minimap: { enabled: false }, wordWrap: "on" }} />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
