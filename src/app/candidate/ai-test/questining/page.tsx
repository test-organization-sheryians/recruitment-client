"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import { useActiveQuestions } from "@/features/test/hooks/useActivation";
import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";
import { useSubmitResult } from "@/features/test/hooks/useResultTest";

import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
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

interface EvaluationResult {
  score: number;
  percentage: number;
  feedback: string;
}

const MIN = 25;
const MAX = 75;
const INIT = 50;


export default function UniversalInterviewPage() {
  const router = useRouter();
  useQueryClient();

  const { data: questions = [], isLoading } = useActiveQuestions() as {
    data: Question[] | undefined;
    isLoading: boolean;
  };

  const evaluateMutation = useEvaluateAnswers() as {
    mutateAsync: (payload: {
      questions: string[];
      answers: string[];
    }) => Promise<{ data: EvaluationResult }>;
  };

  const submitMutation = useSubmitResult() as any;

  const [step, setStep] = useState(0);

  const [answers, setAnswers] = useState<CandidateAnswer[]>(
    questions.length > 0 ? Array(questions.length).fill({}) : []
  );

  const current = questions[step] as Question;
  const isMCQ = Array.isArray((current as MCQQuestion)?.options);

  const [text, setText] = useState("");
  const [code, setCode] = useState("");

  const progress = questions.length
    ? ((step + 1) / questions.length) * 100
    : 0;

  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(INIT);
  const [dragging, setDragging] = useState(false);

  const prevent = (e: any) => e.preventDefault();

  const keyBlock = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key)) {
      e.preventDefault();
    }
  };

  const save = () => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[step] = isMCQ ? { text } : { text, code };
      return updated;
    });
  };

  const next = () => {
    save();

    if (step < questions.length - 1) {
      const n = step + 1;
      setStep(n);
      const ans = answers[n];
      setText(ans?.text ?? "");
      setCode(ans?.code ?? "");
    } else {
      submit();
    }
  };

  const prev = () => {
    save();

    if (step > 0) {
      const n = step - 1;
      setStep(n);
      const ans = answers[n];
      setText(ans?.text ?? "");
      setCode(ans?.code ?? "");
    }
  };

 
  const submit = async () => {
    const aiQ: string[] = [];
    const aiA: string[] = [];
    const fullAiAns: CandidateAnswer[] = [];

    const tq: string[] = [];
    const ta: ApiAnswer[] = [];

    questions.forEach((q, i) => {
      const ans = answers[i];
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


    if (aiQ.length > 0) {
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

      return router.push("/candidate/ai-test/result");
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
        durationTaken: 0,
      },
      {
        onSuccess: () => {
          console.log("TEST SUBMITTED SUCCESSFULLY ✔️");
          router.push("/candidate/ai-test/submitted");
        },
        onError: (err: any) => {
          console.error("SUBMIT ERROR :", err);
          alert("Submission failed: " + err.message);
        },
      }
    );
  };


  const startDrag = useCallback(() => {
    setDragging(true);
    document.body.style.cursor = "col-resize";
  }, []);

  const stopDrag = useCallback(() => {
    setDragging(false);
    document.body.style.cursor = "default";
  }, []);

  const onDrag = useCallback(
    (e: MouseEvent) => {
      if (!dragging || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const w = ((e.clientX - rect.left) / rect.width) * 100;
      setWidth(Math.max(MIN, Math.min(MAX, w)));
    },
    [dragging]
  );

  if (typeof window !== "undefined") {
    window.onmouseup = stopDrag;
    window.onmousemove = (e) => dragging && onDrag(e);
  }


  if (isLoading)
    return (
      <p className="text-center p-6 text-lg text-gray-600">
        Preparing questions...
      </p>
    );

  if (!questions.length)
    return (
      <p className="text-center p-6 text-lg text-gray-600">
        No questions found.
      </p>
    );


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#dfe7ff] to-white">
    
      <div className="sticky top-0 bg-white/70 backdrop-blur-xl border-b shadow-sm z-50">
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="relative px-6 py-4 flex items-center justify-between">
          <button
            onClick={prev}
            disabled={step === 0}
            className="w-12 h-12 rounded-full border bg-white flex items-center justify-center disabled:opacity-40 hover:bg-gray-100"
          >
            <ChevronLeft />
          </button>

          <h2 className="absolute left-1/2 -translate-x-1/2 font-medium text-gray-700 text-center w-[60%] line-clamp-2">
            Q{step + 1}. {current.question}
          </h2>

          <button
            onClick={next}
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
          >
            {step === questions.length - 1 ? <Send /> : <ChevronRight />}
          </button>
        </div>
      </div>


      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div
          ref={ref}
          className="bg-white shadow-xl border rounded-2xl flex min-h-[70vh]"
        >
          
          {isMCQ ? (
            <div className="p-10 w-full flex justify-center">
              <div className="space-y-4 max-w-xl w-full">
                {(current as MCQQuestion).options.map((opt, i) => (
                  <label
                    key={i}
                    onClick={() => setText(opt)}
                    className={`block p-4 pl-12 rounded-xl border cursor-pointer relative transition-all ${
                      text === opt
                        ? "border-blue-600 bg-blue-50 ring-2 ring-blue-300"
                        : "border-gray-300 hover:bg-blue-50"
                    }`}
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      {text === opt ? (
                        <CheckCircle2 className="text-blue-600" />
                      ) : (
                        <Circle className="text-gray-400" />
                      )}
                    </div>
                    <span className="text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <>
            
              <div
                style={{ width: `${width}%` }}
                className="border-r bg-gray-50 flex flex-col"
              >
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onPaste={prevent}
                  onCopy={prevent}
                  onCut={prevent}
                  onKeyDown={keyBlock}
                  placeholder="Explain your thought process..."
                  className="flex-1 p-6 outline-none resize-none bg-transparent"
                />
              </div>

            
              <div
                className="w-2 bg-gray-200 hover:bg-blue-400 cursor-col-resize relative"
                onMouseDown={startDrag}
              >
                <GripVertical className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600" />
              </div>

              <div
                style={{ width: `${100 - width}%` }}
                className="bg-gray-900 flex flex-col"
              >
                
                <div className="p-3 bg-gray-800 border-b border-gray-700">
                  <h2 className="text-white text-sm font-semibold tracking-wide">
                    Write your code here
                  </h2>
                </div>

              
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(v) => setCode(v ?? "")}
                  theme="vs-dark"
                  onMount={(editor: monaco.editor.IStandaloneCodeEditor) => {
                    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
                    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
                    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
                    editor.updateOptions({ contextmenu: false });
                    editor.getDomNode()?.addEventListener("paste", prevent);
                  }}
                  options={{
                    minimap: { enabled: false },
                    wordWrap: "on",
                    fontSize: 15,
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
