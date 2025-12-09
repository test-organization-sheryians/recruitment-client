"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveQuestions } from "../../../../features/AITest/hooks/useActivation";
import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";

import Editor from "@monaco-editor/react";
import { KeyMod, KeyCode } from "monaco-editor";
import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight, Send, Timer, CheckCircle2, Circle } from "lucide-react";

export default function UniversalInterviewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useActiveQuestions();
  const evaluate = useEvaluateAnswers();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");

  const current = questions[step];
  const isMCQ = Array.isArray(current?.options);
  const progress = ((step + 1) / questions.length) * 100;

  const prevent = useCallback((e: any) => e.preventDefault(), []);
  const keyBlock = useCallback(
    (e: any) => {
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key?.toLowerCase()))
        e.preventDefault();
    },
    []
  );

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-2xl font-light animate-pulse">Preparing your interview...</div>
    </div>
  );

  if (!questions.length) return <p className="text-center text-white">No questions found</p>;

  const save = () => {
    const clone = [...answers];
    clone[step] = isMCQ ? text : { text, code };
    setAnswers(clone);
  };

  const next = () => {
    save();
    if (step < questions.length - 1) {
      setStep(step + 1);
      setText("");
      setCode("");
    } else {
      submit();
    }
  };

  const prev = () => {
    save();
    if (step > 0) setStep(step - 1);
  };

  const flatten = () =>
    answers.map((a) => (typeof a === "object" ? `${a.text}\n${a.code}` : a));

  const submit = async () => {
    save();
    const payload = {
      questions: questions.map((q) => q.question),
      answers: flatten(),
    };

    const result = await evaluate.mutateAsync(payload);
    queryClient.removeQueries({ queryKey: ["active-questions"] });
    router.replace(`/ai-test/result?data=${encodeURIComponent(JSON.stringify(result))}`);
  };

  const editorMount = (editor: any) => {
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
    editor.updateOptions({ contextmenu: false });
    editor.getDomNode()?.addEventListener("paste", prevent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-white/10 z-50">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                Coding Interview
              </div>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Timer className="w-4 h-4" />
                <span>Question {step + 1} of {questions.length}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={prev}
                disabled={step === 0}
                className="px-5 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center gap-2 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
                Previous
              </button>

              <button
                onClick={next}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 flex items-center gap-3 font-medium shadow-2xl shadow-purple-500/20 transition-all"
              >
                {step === questions.length - 1 ? (
                  <>
                    <Send className="w-5 h-5" />
                    Submit Interview
                  </>
                ) : (
                  <>
                    Next Question
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Question Indicator Dots */}
          <div className="flex gap-2 justify-center">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`transition-all duration-300 ${
                  i === step
                    ? "w-10 h-3 bg-cyan-400 rounded-full"
                    : i < step
                    ? "w-3 h-3 bg-cyan-400/60 rounded-full"
                    : "w-3 h-3 bg-white/20 rounded-full"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
          <div className="p-10">
            {/* Question Title */}
            <div className="mb-10">
              <div className="flex items-start gap-4">
                <div className="text-5xl font-bold text-cyan-400">Q{step + 1}</div>
                <h1 className="text-2xl font-light leading-relaxed max-w-4xl">
                  {current.question}
                </h1>
              </div>
            </div>

            {/* Answer Section */}
            {isMCQ ? (
              <div className="space-y-4 max-w-2xl mx-auto">
                {current.options?.map((opt: string, i: number) => (
                  <label
                    key={i}
                    onClick={() => setText(opt)}
                    className={`block relative overflow-hidden rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
                      text === opt
                        ? "border-cyan-400 bg-cyan-500/20 shadow-2xl shadow-cyan-500/20"
                        : "border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10"
                    }`}
                  >
                    <div className="p-6 pl-16 flex items-center">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2">
                        {text === opt ? (
                          <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                        ) : (
                          <Circle className="w-7 h-7 text-white/40 group-hover:text-white/80 transition-colors" />
                        )}
                      </div>
                      <span className="text-lg">{opt}</span>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-8">
                {/* Explanation Panel */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-cyan-400 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                      ✍️
                    </div>
                    Explanation
                  </h3>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onPaste={prevent}
                    onCopy={prevent}
                    onCut={prevent}
                    onKeyDown={keyBlock}
                    className="w-full min-h-96 p-6 rounded-2xl bg-white/5 border border-white/20 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 resize-none text-white placeholder-white/40 transition-all backdrop-blur-sm"
                    placeholder="Explain your approach clearly... (Think step-by-step, mention time/space complexity if applicable)"
                  />
                </div>

                {/* Code Editor Panel */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      💻
                    </div>
                    Solution Code
                  </h3>
                  <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                    <Editor
                      height="400px"
                      defaultLanguage="javascript"
                      value={code}
                      onChange={(v) => setCode(v || "")}
                      theme="vs-dark"
                      onMount={editorMount}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 15,
                        lineNumbers: "on",
                        roundedSelection: false,
                        scrollBeyondLastLine: false,
                        wordWrap: "on",
                        padding: { top: 24, bottom: 24 },
                        glyphMargin: false,
                        folding: true,
                        lineDecorationsWidth: 10,
                        lineNumbersMinChars: 3,
                        renderLineHighlight: "all",
                        scrollbar: {
                          verticalScrollbarSize: 10,
                          horizontalScrollbarSize: 10,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="mt-10 flex justify-between items-center">
          <div className="text-sm opacity-70">
            Use ← → arrows or buttons to to navigate
          </div>
          <div className="text-2xl font-light opacity-80">
            {step + 1} / {questions.length}
          </div>
        </div>
      </div>
    </div>
  );
}