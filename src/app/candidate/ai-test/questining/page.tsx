// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Editor from "@monaco-editor/react";
// import { KeyMod, KeyCode } from "monaco-editor";
// import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";

// interface QType {
//   question: string;
//   options?: string[];
// }

// type Ans = string | { text: string; code: string };

// export default function UniversalQuestioningPage() {
//   const router = useRouter();
//   const evalTheory = useEvaluateAnswers(); // subjective eval
// //  const evalMCQ = useEvaluateMCQ();        // MCQ eval

//   const [questions, setQuestions] = useState<QType[]>([]);
//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState<Ans[]>([]);
//   const [text, setText] = useState("");
//   const [code, setCode] = useState("");

//   const prevent = useCallback((e: any) => e.preventDefault(), []);
//   const keyBlock = useCallback((e: any) => {
//     if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key?.toLowerCase()))
//       e.preventDefault();
//   }, []);

//   /* ----------------------------------------------------
//       LOAD QUESTIONS FROM ANY SOURCE
//   -----------------------------------------------------*/
//   useEffect(() => {
//     const fromTest = localStorage.getItem("currentTestQuestions");
//     const fromResume = localStorage.getItem("interviewQuestions");

//     let parsed: QType[] = [];

//     if (fromTest) {
//       const data = JSON.parse(fromTest);

//       if (data?.questions?.test?.questions) {
//         parsed = data.questions.test.questions.map((q: any) => ({
//           question: q.question,
//           options: q.options || null
//         }));
//       } else if (data?.test?.questions) {
//         parsed = data.test.questions;
//       } else if (Array.isArray(data)) {
//         parsed = data;
//       }
//     }

//     if (!parsed.length && fromResume) parsed = JSON.parse(fromResume);

//     if (!parsed.length) {
//       alert("⚠️ No questions found.");
//       return router.push("/");
//     }

//     setQuestions(parsed);
//     setAnswers(new Array(parsed.length).fill(""));
//     localStorage.removeItem("interview_progress"); // avoid mixing
//   }, []);

//   /* ----------------------------------------------------
//       UPDATE UI WHEN CHANGING QUESTION
//   -----------------------------------------------------*/
//   useEffect(() => {
//     const stored = answers[step];
//     if (stored && typeof stored === "object") {
//       setText(stored.text || "");
//       setCode(stored.code || "");
//     } else {
//       setText(typeof stored === "string" ? stored : "");
//       setCode("");
//     }
//   }, [step, answers]);

//   const current = questions[step];
//   const isMCQ = Array.isArray(current?.options);

//   /* ----------------------------------------------------
//       SAVE ANSWER
//   -----------------------------------------------------*/
//   const storeAnswer = () => {
//     const clone = [...answers];
//     clone[step] = isMCQ ? text : { text, code };
//     setAnswers(clone);
//   };

//   const next = () => {
//     storeAnswer();
//     if (step < questions.length - 1) {
//       setStep(step + 1);
//       setText("");
//       setCode("");
//     } else {
//       finalSubmit(cloneAll());
//     }
//   };

//   const prev = () => {
//     if (step === 0) return;
//     storeAnswer();
//     setStep(step - 1);
//   };

//   const cloneAll = () =>
//     answers.map((a) =>
//       typeof a === "object" ? `${a.text}\n\n${a.code}` : a
//     );

//   /* ----------------------------------------------------
//       FINAL SUBMIT BASED ON TYPE
//   -----------------------------------------------------*/
//   const finalSubmit = async (final: string[]) => {
//     try {
//       const payload = {
//         questions: questions.map((q) => q.question),
//         answers: final
//       };

//       let result;
//       if (isMCQ) result = await evalMCQ.mutateAsync(payload);
//       else result = await evalTheory.mutateAsync(payload);
//      // console.log(finalSubmit)

//       localStorage.setItem("finalEvaluation", JSON.stringify(result));
//       router.push("../ai-test/result");
//     } catch (err) {
//       console.error(err);
//       alert("❌ Evaluation failed");
//     }
//   };

//   /* ----------------------------------------------------
//       MONACO CHEAT BLOCK
//   -----------------------------------------------------*/
//   const editorMount = (editor: any) => {
//     editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
//     editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
//     editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
//     editor.updateOptions({ contextmenu: false });

//     editor.getDomNode()?.addEventListener("paste", prevent);
//   };

//   if (!questions.length) return <p className="p-6 text-center">Loading...</p>;

//   /* ----------------------------------------------------
//       UI
//   -----------------------------------------------------*/
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto">

//         <div className="flex justify-between items-center mb-6">
//           <button
//             disabled={step === 0}
//             onClick={prev}
//             className="px-6 py-3 rounded-xl border bg-white hover:bg-gray-100 disabled:bg-gray-300"
//           >
//             ← Previous
//           </button>

//           <h2 className="text-lg font-semibold max-w-[60%] text-center select-none"
//               onCopy={prevent} onPaste={prevent} onCut={prevent}>
//             Q{step + 1}. {current.question}
//           </h2>

//           <button
//             onClick={next}
//             className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
//           >
//             {step === questions.length - 1 ? "Submit" : "Next →"}
//           </button>
//         </div>

//         {/* ------------------ MCQ ------------------ */}
//         {isMCQ ? (
//           <div className="space-y-3">
//             {current.options?.map((opt, i) => (
//               <label
//                 key={i}
//                 className={`block p-4 border rounded-xl cursor-pointer ${
//                   text === opt ? "bg-blue-600 text-white" : "bg-white hover:bg-gray-100"
//                 }`}
//                 onClick={() => setText(opt)}
//               >
//                 <input type="radio" readOnly checked={text === opt} className="mr-2" />
//                 {opt}
//               </label>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-6">
//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               onPaste={prevent}
//               onCopy={prevent}
//               onCut={prevent}
//               onKeyDown={keyBlock}
//               className="w-full min-h-[400px] border p-4 rounded-lg bg-white"
//               placeholder="Write your explanation..."
//             />

//             <Editor
//               height="400px"
//               defaultLanguage="javascript"
//               value={code}
//               onChange={(v) => setCode(v || "")}
//               theme="vs-dark"
//               onMount={editorMount}
//               options={{ minimap: { enabled: false }, wordWrap: "on" }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { KeyMod, KeyCode } from "monaco-editor";
import { useEvaluateAnswers } from "@/features/AITest/hooks/aiTestApi";

import useInterviewLoader from "../../../../features/AITest/hooks/useInterviewLoader";
import QuestionHeader from "../../../../features/AITest/components/QuestionHeader";
import AnswerPanel from "../../../../features/AITest/components/AnswerArea";
import result from "../result/page"

export default function InterviewPage() {
  const router = useRouter();
  const evaluate = useEvaluateAnswers();
  const { questions, loaded } = useInterviewLoader();

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [text, setText] = useState("");
  const [code, setCode] = useState("");

  const prevent = useCallback((e: any) => e.preventDefault(), []);
  const preventKey = useCallback((e: any) => {
    if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(e.key.toLowerCase()))
      e.preventDefault();
  }, []);

  const editorMount = (editor: any) => {
    editor.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
    editor.updateOptions({ contextmenu: false });
  };

  if (!loaded) return <p className="p-6 text-center">Loading…</p>;

  const save = () => {
    const updated = [...answers];
    // NOTE: If text/code is empty, an empty string will be saved for the answer.
    updated[step] = text; 
    setAnswers(updated);
  };

  const next = () => {
    save();
    if (step < questions.length - 1) setStep(step + 1);
    else submit();
    setText("");
    setCode("");
  };

  const prev = () => step > 0 && setStep(step - 1);

  const submit = async () => {
    save();
    const payload = {
      questions: questions.map((q) => q.question),
      answers
    };
    const res = await evaluate.mutateAsync(payload);
    localStorage.setItem("finalEvaluation", JSON.stringify(res));
    router.push("../ai-test/result");
  };

  return (
    <div className="p-6">
      <QuestionHeader
        current={step}
        total={questions.length}
        question={questions[step].question}
        disabled={false} 
        onPrev={prev}
        onNext={next}
        isLast={step === questions.length - 1}
        isLoading={evaluate.isPending}
      />

      <AnswerPanel
        answerText={text}
        answerCode={code}
        onTextChange={setText}
        onCodeChange={setCode}
        prevent={prevent}
        preventKey={preventKey}
        editorMount={editorMount}
      />
    </div>
  );
}





























































// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useRouter } from "next/navigation";
// import Editor from "@monaco-editor/react";
// import { KeyMod, KeyCode } from "monaco-editor";
// import { useEvaluateAnswers, } from "@/features/AITest/hooks/aiTestApi";

// interface Question {
//   question: string;
//   options?: string[];
// }

// type Answer = string | { text: string; code: string };

// export default function QuestioningPage() {
//   const router = useRouter();
//   const evalTheory = useEvaluateAnswers();
//   // const evalMCQ = useEvaluateMCQ();

//   const [questions, setQuestions] = useState<Question[]>([]);
//   const [step, setStep] = useState(0);
//   const [answers, setAnswers] = useState<Answer[]>([]);
//   const [text, setText] = useState("");
//   const [code, setCode] = useState("");

//   const total = questions.length;
//   const current = questions[step];
//   const isMCQ = Array.isArray(current?.options);


//   useEffect(() => {
//     const fromTest = localStorage.getItem("currentTestQuestions");
//     const fromResume = localStorage.getItem("interviewQuestions");

//     let parsed: Question[] = [];

//     if (fromTest) {
//       const t = JSON.parse(fromTest);

//       if (t?.questions?.test?.questions) {
//         parsed = t.questions.test.questions.map((q: any) => ({
//           question: q.question,
//           options: q.options || null
//         }));
//       } else if (Array.isArray(t)) parsed = t;
//       else if (t?.test?.questions) parsed = t.test.questions;
//     }

//     if (!parsed.length && fromResume) parsed = JSON.parse(fromResume);

//     if (!parsed.length) {
//       alert("No questions found");
//       return router.push("/");
//     }

//     setQuestions(parsed);
//     setAnswers(new Array(parsed.length).fill(""));
//   }, []);

//   /* =======================================================
//       RESTORE ANSWER ON STEP CHANGE
//    ======================================================= */
//   useEffect(() => {
//     const stored = answers[step];

//     if (stored && typeof stored === "object") {
//       setText(stored.text || "");
//       setCode(stored.code || "");
//     } else {
//       setText(typeof stored === "string" ? stored : "");
//       setCode("");
//     }
//   }, [step]);

//   /* =======================================================
//       SAVE ANSWER FOR CURRENT QUESTION
//    ======================================================= */
//   const storeAnswer = () => {
//     setAnswers((prev) => {
//       const clone = [...prev];
//       clone[step] = isMCQ ? text : { text, code };
//       return clone;
//     });
//   };

//   /* =======================================================
//       NEXT
//    ======================================================= */
//   const next = () => {
//     storeAnswer();
//     if (step < total - 1) {
//       setStep((p) => p + 1);
//       return;
//     }
//     submit();
//   };

//   /* =======================================================
//       PREV
//    ======================================================= */
//   const prev = () => {
//     if (step === 0) return;
//     storeAnswer();
//     setStep((p) => p - 1);
//   };

//   /* =======================================================
//       COMBINE ANSWERS FOR SUBMISSION
//    ======================================================= */
//   const finalAnswers = () =>
//     answers.map((a) =>
//       typeof a === "object" ? `${a.text}\n\n${a.code}` : a
//     );

//   /* =======================================================
//       SUBMIT (MIXED TEST SUPPORTED)
//    ======================================================= */
//   const submit = async () => {
//     storeAnswer();
//     const payload = {
//       questions: questions.map((q) => q.question),
//       answers: finalAnswers()
//     };

//     try {
//       let result;
//       const allMCQ = questions.every((q) => Array.isArray(q.options));

//       // If whole test is MCQ → evalMCQ
//       if (allMCQ) result = await evalMCQ.mutateAsync(payload);
//       else result = await evalTheory.mutateAsync(payload);

//       localStorage.setItem("finalTestEvaluation", JSON.stringify(result));
//       router.push("/test/result");
//     } catch (e) {
//       console.error(e);
//       alert("Submission failed");
//     }
//   };

//   /* =======================================================
//       MONACO BLOCK COPY/PASTE
//    ======================================================= */
//   const prevent = useCallback((e: any) => e.preventDefault(), []);
//   const keyBlock = useCallback((e: any) => {
//     const k = e.key?.toLowerCase();
//     if ((e.ctrlKey || e.metaKey) && ["c", "v", "x"].includes(k)) prevent(e);
//   }, []);

//   const editorMount = (ed: any) => {
//     ed.addCommand(KeyMod.CtrlCmd | KeyCode.KeyV, () => {});
//     ed.addCommand(KeyMod.CtrlCmd | KeyCode.KeyC, () => {});
//     ed.addCommand(KeyMod.CtrlCmd | KeyCode.KeyX, () => {});
//     ed.updateOptions({ contextmenu: false });
//     ed.getDomNode()?.addEventListener("paste", prevent);
//   };

//   if (!questions.length) return <p className="p-4 text-center">Loading...</p>;

//   /* =======================================================
//       UI
//    ======================================================= */
//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-4xl mx-auto">

//         <div className="flex justify-between items-center mb-6">
//           <button onClick={prev} disabled={step === 0} className="btn">
//             ← Previous
//           </button>

//           <h2 className="text-xl font-semibold">
//             Q{step + 1}/{total}: {current.question}
//           </h2>

//           <button onClick={next} className="btn-primary">
//             {step === total - 1 ? "Submit" : "Next →"}
//           </button>
//         </div>

//         {/* MCQ */}
//         {isMCQ ? (
//           <div className="space-y-3">
//             {current.options?.map((opt, i) => (
//               <label
//                 key={i}
//                 className={`block p-4 border rounded-xl cursor-pointer ${
//                   text === opt ? "bg-blue-600 text-white" : "bg-white"
//                 }`}
//                 onClick={() => setText(opt)}
//               >
//                 <input type="radio" checked={text === opt} readOnly className="mr-2" />
//                 {opt}
//               </label>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 gap-6">
//             <textarea
//               value={text}
//               onChange={(e) => setText(e.target.value)}
//               onPaste={prevent}
//               onCopy={prevent}
//               onCut={prevent}
//               onKeyDown={keyBlock}
//               className="p-4 min-h-[400px] border rounded-lg"
//               placeholder="Write your logic/explanation..."
//             />

//             <Editor
//               height="400px"
//               onMount={editorMount}
//               defaultLanguage="javascript"
//               value={code}
//               onChange={(v) => setCode(v || "")}
//               theme="vs-dark"
//               options={{ minimap: { enabled: false }, wordWrap: "on" }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
