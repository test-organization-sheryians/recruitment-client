"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useActiveQuestions } from "../../../../features/AITest/hooks/useActivation";
import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";

import Editor from "@monaco-editor/react";
import { KeyMod, KeyCode } from "monaco-editor";
import { useState, useCallback, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Send, CheckCircle2, Circle, Code, GripVertical } from "lucide-react";

const MIN_WIDTH_PERCENT = 25;
const MAX_WIDTH_PERCENT = 75;
const INITIAL_WIDTH_PERCENT = 50;

export default function UniversalInterviewPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: questions = [], isLoading } = useActiveQuestions();
  const evaluate = useEvaluateAnswers();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTH_PERCENT);
  const [isDragging, setIsDragging] = useState(false);

  const current = questions[step];
  const isMCQ = Array.isArray(current?.options);
  const progress = ((step + 1) / questions.length) * 100;

  const prevent = useCallback((e: any) => e.preventDefault(), []);
  const keyBlock = useCallback((e: any) => {
    if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key?.toLowerCase())) e.preventDefault();
  }, []);

  const startDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.cursor = "col-resize";
  };

  const onDrag = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - rect.left) / rect.width) * 100;
      setLeftWidth(Math.max(MIN_WIDTH_PERCENT, Math.min(MAX_WIDTH_PERCENT, newWidth)));
    },
    [isDragging]
  );

  const stopDrag = () => {
    setIsDragging(false);
    document.body.style.cursor = "default";
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", stopDrag);
      return () => {
        document.removeEventListener("mousemove", onDrag);
        document.removeEventListener("mouseup", stopDrag);
      };
    }
  }, [isDragging, onDrag]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#E7E9F1] to-[#F6F7FB]">
        <div className="text-[#1E47FF] text-xl font-medium animate-pulse">Preparing questions...</div>
      </div>
    );

  if (!questions.length) return <p className="text-center text-gray-700 py-10">No questions found</p>;

  const save = () => {
    const clone = [...answers];
    clone[step] = isMCQ ? text : { text, code };
    setAnswers(clone);
  };

  const formatAnswers = () =>
    answers.map((a) => (typeof a === "string" ? a : `${a.text}\n${a.code}`));

  const next = () => {
    save();
    if (step < questions.length - 1) {
      setStep(step + 1);
      setText("");
      setCode("");
    } else submit();
  };

  const prev = () => {
    save();
    if (step > 0) setStep(step - 1);
  };

  const submit = async () => {
    save();

    const payload = {
      questions: questions.map((q) => q.question),
      answers: formatAnswers(),
    };

    const result = await evaluate.mutateAsync(payload);

    localStorage.setItem("interviewResult", JSON.stringify(result));

    queryClient.removeQueries({ queryKey: ["active-questions"] });
    router.replace("/candidate/ai-test/result");
  };

  const editorMount = (editor: any) => {
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
    editor.updateOptions({ contextmenu: false });
    editor.getDomNode()?.addEventListener("paste", prevent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E7E9F1] via-[#F6F7FB] to-white flex flex-col">

      {/* HEADER - CLEAN, NO DUPLICATION */}
      <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
        <div className="h-1 bg-gray-200">
          <div className="h-full bg-gradient-to-r from-[#1E47FF] to-[#61A0FF]" style={{ width: `${progress}%` }} />
        </div>

        <div className="relative w-full px-6 py-3 flex items-center justify-between">

          {/* prev btn */}
          <button
            onClick={prev}
            disabled={step === 0}
            className="w-10 h-10 rounded-full border bg-white hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center absolute left-4 top-1/2 -translate-y-1/2"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* question at center */}
          <h2 className="w-full text-center text-lg font-semibold text-gray-800 max-w-4xl mx-auto leading-relaxed">
            Q{step + 1}. {current.question}
          </h2>

          {/* next / submit */}
          <button
            onClick={next}
            className={`absolute right-4 top-1/2 -translate-y-1/2 bg-[#1E47FF] hover:bg-[#375FFF] text-white transition 
              ${step === questions.length - 1 ? "px-5 py-2 rounded-lg text-sm" : "w-10 h-10 rounded-full flex items-center justify-center"}`}
          >
            {step === questions.length - 1 ? (
              <>
                <Send className="w-4 h-4 mr-1" /> Submit
              </>
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>

        </div>
      </header>

      {/* BODY */}
      <main className="flex-1 p-6 max-w-6xl mx-auto w-full">
        <div ref={containerRef} className="bg-white rounded-xl border shadow-lg min-h-[70vh] flex">

          {isMCQ ? (
            <div className="p-10 w-full flex items-center justify-center">
              <div className="space-y-4 max-w-xl w-full">
                {current.options?.map((opt: string, i: number) => (
                  <label
                    key={i}
                    onClick={() => setText(opt)}
                    className={`block p-4 pl-12 rounded-xl border cursor-pointer relative transition 
                      ${text === opt ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/50" : "border-gray-200 hover:bg-blue-50"}`}
                  >
                    <div className="absolute left-4 top-1/2 -translate-y-1/2">
                      {text === opt ? <CheckCircle2 className="text-blue-500" /> : <Circle className="text-gray-400" />}
                    </div>
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div style={{ width: `${leftWidth}%` }} className="flex flex-col border-r">
                <h3 className="p-4 text-lg font-semibold">Explain Logic</h3>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onPaste={prevent}
                  onCopy={prevent}
                  onCut={prevent}
                  onKeyDown={keyBlock}
                  className="flex-1 p-6 outline-none"
                  placeholder="Explain your thought process..."
                />
              </div>

              <div className="w-2 bg-gray-200 hover:bg-blue-500 cursor-col-resize" onMouseDown={startDrag}>
                <GripVertical className="text-gray-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>

              <div style={{ width: `${100 - leftWidth}%` }} className="flex flex-col bg-gray-900">
                <h3 className="p-4 border-b border-gray-700 text-white flex items-center gap-2">
                  <Code className="text-blue-400" /> Code
                </h3>
                <Editor
                  height="100%"
                  defaultLanguage="javascript"
                  value={code}
                  onChange={(v) => setCode(v || "")}
                  theme="vs-dark"
                  onMount={editorMount}
                  options={{ minimap: { enabled: false }, wordWrap: "on" }}
                />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}



















































// "use client";

// import { useRouter } from "next/navigation";
// import { useQueryClient } from "@tanstack/react-query";
// import { useActiveQuestions } from "../../../../features/AITest/hooks/useActivation";
// import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";

// import Editor from "@monaco-editor/react";
// import { KeyMod, KeyCode } from "monaco-editor";
// import { useState, useCallback, useRef, useEffect } from "react";
// import { ChevronLeft, ChevronRight, Send, Timer, CheckCircle2, Circle, Code, GripVertical } from "lucide-react";

// // Min/Max width constraints for the vertical splitter
// const MIN_WIDTH_PERCENT = 25;
// const MAX_WIDTH_PERCENT = 75;
// const INITIAL_WIDTH_PERCENT = 50;

// export default function UniversalInterviewPage() {
//     const router = useRouter();
//     const queryClient = useQueryClient();

//     const { data: questions = [], isLoading } = useActiveQuestions();
//     const evaluate = useEvaluateAnswers();

//     // UI & Answer State
//     const [step, setStep] = useState(0);
//     const [answers, setAnswers] = useState<any[]>([]);
//     const [text, setText] = useState("");
//     const [code, setCode] = useState("");

//     // Splitter State and Refs
//     const containerRef = useRef<HTMLDivElement>(null);
//     const [leftWidth, setLeftWidth] = useState(INITIAL_WIDTH_PERCENT);
//     const [isDragging, setIsDragging] = useState(false);

//     const current = questions[step];
//     const isMCQ = Array.isArray(current?.options);
//     const progress = ((step + 1) / questions.length) * 100;

//     // Prevention Callbacks
//     const prevent = useCallback((e: any) => e.preventDefault(), []);
//     const keyBlock = useCallback(
//         (e: any) => {
//             if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key?.toLowerCase()))
//                 e.preventDefault();
//         },
//         []
//     );

//     // Draggable Splitter Logic
//     const startDrag = (e: React.MouseEvent) => {
//         e.preventDefault();
//         setIsDragging(true);
//         document.body.style.cursor = "col-resize";
//     };

//     const onDrag = useCallback(
//         (e: MouseEvent) => {
//             if (!isDragging || !containerRef.current) return;
//             const containerRect = containerRef.current.getBoundingClientRect();
//             const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
            
//             // Apply constraints
//             const constrainedWidth = Math.max(MIN_WIDTH_PERCENT, Math.min(MAX_WIDTH_PERCENT, newWidth));
//             setLeftWidth(constrainedWidth);
//         },
//         [isDragging]
//     );

//     const stopDrag = () => {
//         setIsDragging(false);
//         document.body.style.cursor = "default";
//     };

//     useEffect(() => {
//         if (isDragging) {
//             document.addEventListener("mousemove", onDrag);
//             document.addEventListener("mouseup", stopDrag);
//             return () => {
//                 document.removeEventListener("mousemove", onDrag);
//                 document.removeEventListener("mouseup", stopDrag);
//             };
//         }
//     }, [isDragging, onDrag]);

//     // --- Core Logic ---

//     if (isLoading)
//         return (
//             <div className="min-h-screen bg-gradient-to-b from-[#E7E9F1] to-[#F6F7FB] flex items-center justify-center">
//                 <div className="text-[#1E47FF] text-2xl font-medium animate-pulse">Preparing questions...</div>
//             </div>
//         );

//     if (!questions.length) return <p className="text-center text-gray-700 py-20">No questions found</p>;

//     const save = () => {
//         const clone = [...answers];
//         clone[step] = isMCQ ? text : { text, code };
//         setAnswers(clone);
//     };

//     const next = () => {
//         save();
//         if (step < questions.length - 1) {
//             setStep(step + 1);
//             setText("");
//             setCode("");
//         } else {
//             submit();
//         }
//     };

//     const prev = () => {
//         save();
//         if (step > 0) setStep(step - 1);
//     };

//     const flatten = () =>
//         answers.map((a) => (typeof a === "object" ? `${a.text}\n${a.code}` : a));

//     const submit = async () => {
//         save();
//         const payload = {
//             questions: questions.map((q) => q.question),
//             answers: flatten(),
//         };

//         const result = await evaluate.mutateAsync(payload);
//         queryClient.removeQueries({ queryKey: ["active-questions"] });
//         router.replace(`/ai-test/result?data=${encodeURIComponent(JSON.stringify(result))}`);
//     };

//     const editorMount = (editor: any) => {
//         editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
//         editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
//         editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
//         editor.updateOptions({ contextmenu: false });
//         editor.getDomNode()?.addEventListener("paste", prevent);
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-b from-[#E7E9F1] via-[#F7F7FB] to-white text-gray-800 flex flex-col">
            
//             {/* 1. COMPACT FIXED HEADER BAR (UPDATED PLACEMENT) */}
//             <div className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
                
//                 {/* Progress bar */}
//                 <div className="h-1 bg-gray-200">
//                     <div
//                         className="h-full bg-gradient-to-r from-[#1E47FF] to-[#61A0FF] transition-all duration-500"
//                         style={{ width: `${progress}%` }}
//                     />
//                 </div>

//               {/* ===== FIXED HEADER (Buttons in true corners, question stays centered) ===== */}
// <div className="sticky top-0 z-50 bg-white shadow-md border-b border-gray-100">
  
//   {/* Progress bar */}
//   <div className="h-1 bg-gray-200">
//     <div
//       className="h-full bg-gradient-to-r from-[#1E47FF] to-[#61A0FF] transition-all duration-500"
//       style={{ width: `${progress}%` }}
//     />
//   </div>

//   <div className="relative w-full px-6 py-3 flex items-center justify-between select-none">

//     {/* -------- Left Corner: PREVIOUS button (locked position) -------- */}
//     <button
//       onClick={prev}
//       disabled={step === 0}
//       className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center transition"
//     >
//       <ChevronLeft className="w-5 h-5 text-gray-700" />
//     </button>

//     {/* -------- Center: QUESTION always fixed center (never moves) -------- */}
//     <div className="w-full flex justify-center pointer-events-none">
//       <h2 className="max-w-xl text-center text-base font-semibold text-gray-800 ">
//         Q{step + 1}. <span className="font-normal">{current.question}</span>
//       </h2>
//     </div>

//     {/* -------- Right Corner: NEXT / SUBMIT button (locked position) -------- */}
//     <button
//       onClick={next}
//       className={`absolute right-6 top-1/2 -translate-y-1/2 
//         transition-all duration-300 bg-[#1E47FF] hover:bg-[#375FFF] text-white shadow-md
//         ${step === questions.length - 1 
//           ? "px-4 py-2 rounded-lg text-sm font-medium"
//           : "w-11 h-11 rounded-full flex items-center justify-center"}`}
//     >
//       {step === questions.length - 1 ? (
//         <>
//           <Send className="inline w-4 h-4 mr-1" /> Submit
//         </>
//       ) : (
//         <ChevronRight className="w-5 h-5" />
//       )}
//     </button>

//   </div>
// </div>

//             </div>

//             {/* 2. MAXIMIZED WORKSPACE */}
//             <div className="flex-1 overflow-auto p-6 max-w-6xl mx-auto w-full">
//                 <div className="bg-white rounded-xl shadow-2xl border border-gray-200 flex-1 min-h-[calc(100vh-180px)]" ref={containerRef}>
                    
//                     {/* --- MCQ BLOCK --- */}
//                     {isMCQ ? (
//                         <div className="p-10 flex items-center justify-center h-full">
//                             <div className="space-y-4 max-w-xl w-full">
//                                 <h3 className="text-xl font-semibold text-[#1E47FF] mb-5">Select Your Answer</h3>
//                                 {current.options?.map((opt: string, i: number) => (
//                                     <label
//                                         key={i}
//                                         onClick={() => setText(opt)}
//                                         className={`block relative rounded-xl border transition-all duration-300 cursor-pointer ${
//                                             text === opt
//                                                 ? "border-blue-500 bg-blue-50 shadow-lg ring-2 ring-blue-500/50"
//                                                 : "border-gray-200 bg-gray-50 hover:border-blue-400 hover:bg-blue-50"
//                                         }`}
//                                     >
//                                         <div className="p-4 pl-12 flex items-center gap-3 relative">
//                                             <div className="absolute left-4 top-1/2 -translate-y-1/2">
//                                                 {text === opt ? (
//                                                     <CheckCircle2 className="w-5 h-5 text-blue-600" />
//                                                 ) : (
//                                                     <Circle className="w-5 h-5 text-gray-400" />
//                                                 )}
//                                             </div>
//                                             <span className="text-base font-medium">{opt}</span>
//                                         </div>
//                                     </label>
//                                 ))}
//                             </div>
//                         </div>
//                     ) : (
//                         /* --- CODING BLOCK (Draggable Vertical Split) --- */
//                         <div className="flex h-full min-h-[500px]">
                            
//                             {/* Left: Explanation */}
//                             <div style={{ width: `${leftWidth}%` }} className="flex flex-col border-r border-gray-200">
//                                 <h3 className="text-lg font-semibold text-[#1E47FF] p-4 border-b border-gray-100 bg-gray-50">Explain Logic</h3>
//                                 <textarea
//                                     value={text}
//                                     onChange={(e) => setText(e.target.value)}
//                                     onPaste={prevent}
//                                     onCopy={prevent}
//                                     onCut={prevent}
//                                     onKeyDown={keyBlock}
//                                     placeholder="Explain your approach clearly (Time/Space Complexity, Edge Cases)..."
//                                     className="flex-1 w-full p-6 text-base resize-none outline-none bg-white/90"
//                                 />
//                             </div>

//                             {/* Vertical Splitter */}
//                             <div
//                                 className="w-2 bg-gray-200 hover:bg-blue-500 cursor-col-resize flex items-center justify-center transition-colors relative group flex-shrink-0"
//                                 onMouseDown={startDrag}
//                             >
//                                 <GripVertical className="w-5 h-5 text-gray-400 group-hover:text-white z-10" />
//                             </div>

//                             {/* Right: Code */}
//                             <div style={{ width: `${100 - leftWidth}%` }} className="flex flex-col bg-gray-900">
//                                 <h3 className="text-lg font-semibold text-white p-4 border-b border-gray-700 bg-gray-800 flex items-center gap-2">
//                                     <Code className="w-5 h-5 text-blue-400" /> Solution Code (JavaScript)
//                                 </h3>
//                                 <div className="flex-1">
//                                     <Editor
//                                         height="100%" // Take up remaining height
//                                         defaultLanguage="javascript"
//                                         value={code}
//                                         onChange={(v) => setCode(v || "")}
//                                         theme="vs-dark"
//                                         onMount={editorMount}
//                                         options={{
//                                             minimap: { enabled: false },
//                                             fontSize: 15,
//                                             wordWrap: "on",
//                                             padding: { top: 20, bottom: 20 },
//                                             automaticLayout: true,
//                                             scrollBeyondLastLine: false,
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }