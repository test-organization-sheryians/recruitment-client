// "use client";

// import { useEffect, useRef, useState } from "react";
// import { Plus, Trash2, X, HelpCircle, CheckCircle2 } from "lucide-react";
// import Select from "@/components/ui/select";
// import { addJobQuestions, updateJobQuestion, deleteJobQuestion } from "@/api/jobs/addJobQuestions";
// import type { JobQuestion } from "@/types/JobQuestion";
// import { useToast } from "@/components/ui/Toast"; // ✅ TOAST IMPORT

// type QuestionRow = JobQuestion;

// export default function AddQuestionsModal({
//     jobId,
//     onClose,
//     onSaved,
//     initialQuestions,
// }: {
//     jobId: string;
//     onClose: () => void;
//     onSaved?: () => void;
//     initialQuestions?: QuestionRow[];
// }) {
//     const toast = useToast(); // ✅ TOAST HOOK

//     const [questions, setQuestions] = useState<QuestionRow[]>(
//         initialQuestions?.length
//             ? initialQuestions
//             : [{ title: "", inputType: "text", options: [], isRequired: false }]
//     );

//     const [loading, setLoading] = useState(false);
//     const [qErrors, setQErrors] = useState<Record<number, { title?: string; options?: string }>>({});
//     const firstInputRef = useRef<HTMLInputElement | null>(null);
//     const hasQErrors = Object.values(qErrors).some((r) => !!(r && (r.title || r.options)));

//     /* 🔒 Lock background scroll */
//     useEffect(() => {
//         document.body.style.overflow = "hidden";
//         return () => {
//             document.body.style.overflow = "";
//         };
//     }, []);

//     useEffect(() => {
//         firstInputRef.current?.focus();
//     }, []);

//     /* ----------------- Helpers ----------------- */
//     const updateRow = (i: number, patch: Partial<QuestionRow>) => {
//         setQuestions((prev) =>
//             prev.map((q, idx) => (idx === i ? { ...q, ...patch } : q))
//         );
//         setQErrors((prev) => ({ ...prev, [i]: { ...(prev[i] || {}), title: "", options: "" } }));
//     };

//     const addRow = () => {
//         setQuestions((prev) => [
//             ...prev,
//             { title: "", inputType: "text", options: [], isRequired: false },
//         ]);
//     };

//     const removeRow = async (i: number) => {
//         const id = questions[i]?._id;
//         if (id) {
//             try {
//                 await deleteJobQuestion(jobId, id);
//                 setQuestions((prev) => prev.filter((_, idx) => idx !== i));
//                 setQErrors({});
//                 toast.success("Question deleted successfully");
//             } catch (error) {
//                 toast.error("Failed to delete question");
//             }
//         } else {
//             // If no ID (new question), just remove from UI
//             setQuestions((prev) => prev.filter((_, idx) => idx !== i));
//             setQErrors({});
//             toast.success("Question removed successfully");
//         }
//     };

//     const addOption = (i: number) =>
//         updateRow(i, { options: [...questions[i].options, ""] });

//     const updateOption = (qi: number, oi: number, value: string) => {
//         updateRow(qi, {
//             options: questions[qi].options.map((opt, idx) =>
//                 idx === oi ? value : opt
//             ),
//         });
//     };

//     const removeOption = (qi: number, oi: number) => {
//         updateRow(qi, {
//             options: questions[qi].options.filter((_, idx) => idx !== oi),
//         });
//     };

//     const saveAll = async () => {
//         const allValid = questions.every((_, i) => validateQuestion(i));
//         if (!allValid) {
//             // ❌ VALIDATION ERROR TOAST
//             toast.error("Please fix all errors before saving");
//             return;
//         }

//         setLoading(true);
//         try {
//             const toCreate = questions.filter((q) => !q._id);
//             const toUpdate = questions.filter((q) => q._id);

//             // Add questions toast
//             if (toCreate.length) {
//                 await addJobQuestions(jobId, toCreate);
//                 toast.success(`${toCreate.length} question(s) added successfully`);
//             }

//             // Update questions toast
//             if (toUpdate.length) {
//                 await Promise.all(
//                     toUpdate.map((q) => updateJobQuestion(jobId, q._id!, q))
//                 );
//                 toast.success(`${toUpdate.length} question(s) updated successfully`);
//             }

//             onClose();
//         } catch (error) {
//             // ❌ ERROR TOAST
//             toast.error("Failed to save questions. Please try again");
//         } finally {
//             setLoading(false);
//         }
//     };

//     /* ----------------- Validation ----------------- */
//     const optionTypes = new Set(["radio", "checkbox", "dropdown"]);

//     const validateQuestion = (i: number) => {
//         const q = questions[i];
//         let ok = true;
//         const rowErr: { title?: string; options?: string } = {};

//         if (!q.title || q.title.trim().length === 0) {
//             rowErr.title = "Please enter question text";
//             ok = false;
//         } else if (q.title.trim().length < 5) {
//             rowErr.title = "Question title must be at least 5 characters";
//             ok = false;
//         }

//         if (optionTypes.has(q.inputType)) {
//             if (!Array.isArray(q.options) || q.options.length < 2) {
//                 rowErr.options = "Add at least two options";
//                 ok = false;
//             } else if (q.options.some((o) => !o || o.trim().length === 0)) {
//                 rowErr.options = "All options must be non-empty";
//                 ok = false;
//             }
//         }

//         setQErrors((prev) => ({ ...prev, [i]: rowErr }));
//         return ok;
//     };

//     /* ----------------- UI ----------------- */
//     return (
//         <>
//             {/* Backdrop */}
//             <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"></div>

//             {/* Sidebar */}
//             <div className="fixed inset-y-0 right-0 w-[500px] bg-white dark:bg-[#1a1e2e] shadow-2xl z-[70] flex flex-col border-l border-[#dbdde6] dark:border-gray-800">
//                 <div className="p-6 border-b border-[#dbdde6] dark:border-gray-800 flex items-center justify-between">
//                     <div>
//                         <h2 className="text-xl font-bold text-[#111218] dark:text-white leading-tight">Add New Question</h2>
//                         <p className="text-xs text-[#616889] dark:text-gray-400 mt-1">Configure screening logic and input details</p>
//                     </div>
//                     <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-[#616889]">
//                         <span className="material-symbols-outlined">close</span>
//                     </button>
//                 </div>
//                 <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
//                     <form className="space-y-6">
//                         <div>
//                             <label className="block text-sm font-bold text-[#111218] dark:text-gray-200 mb-2">Question Title</label>
//                             <input
//                                 ref={firstInputRef}
//                                 value={questions[0]?.title || ""}
//                                 onChange={(e) => updateRow(0, { title: e.target.value })}
//                                 onBlur={() => validateQuestion(0)}
//                                 className="w-full rounded-lg border-[#dbdde6] dark:border-gray-700 dark:bg-[#111218] focus:ring-primary focus:border-primary text-sm"
//                                 placeholder="e.g. How many years of experience do you have?"
//                                 type="text"
//                             />
//                             {qErrors[0]?.title && <p className="mt-2 text-xs text-red-600">{qErrors[0].title}</p>}
//                         </div>
//                         <div>
//                             <label className="block text-sm font-bold text-[#111218] dark:text-gray-200 mb-2">Description (Optional)</label>
//                             <textarea
//                                 className="w-full rounded-lg border-[#dbdde6] dark:border-gray-700 dark:bg-[#111218] focus:ring-primary focus:border-primary text-sm"
//                                 placeholder="Provide additional context for the candidate..."
//                                 rows={3}
//                             ></textarea>
//                         </div>
//                         <div>
//                             <label className="block text-sm font-bold text-[#111218] dark:text-gray-200 mb-2">Input Type</label>
//                             <Select
//                                 value={questions[0]?.inputType || "text"}
//                                 onChange={(e) => {
//                                     const val = (e.target as HTMLSelectElement).value;
//                                     updateRow(0, {
//                                         inputType: val,
//                                         options: val === "radio" || val === "checkbox" || val === "dropdown" ? ["", ""] : [],
//                                     });
//                                 }}
//                                 className="w-full rounded-lg border-[#dbdde6] dark:border-gray-700 dark:bg-[#111218] focus:ring-primary focus:border-primary text-sm"
//                                 options={[
//                                     "text",
//                                     "textarea",
//                                     "radio",
//                                     "checkbox",
//                                     "dropdown",
//                                     "yes-no",
//                                     "file",
//                                     "date",
//                                     "number",
//                                     "rating",
//                                 ].map((type) => ({ value: type, label: type }))}
//                             />
//                         </div>
//                         {(questions[0]?.inputType === "radio" || questions[0]?.inputType === "checkbox" || questions[0]?.inputType === "dropdown") && (
//                             <div className="space-y-3">
//                                 <div className="flex items-center justify-between">
//                                     <label className="block text-sm font-bold text-[#111218] dark:text-gray-200">Options</label>
//                                     <button
//                                         onClick={() => addOption(0)}
//                                         className="text-xs font-bold text-primary hover:underline"
//                                         type="button"
//                                     >
//                                         + Add Option
//                                     </button>
//                                 </div>
//                                 <div className="space-y-2">
//                                     {questions[0]?.options.map((opt, oi) => (
//                                         <div key={oi} className="flex items-center gap-2">
//                                             <input
//                                                 value={opt}
//                                                 onChange={(e) => updateOption(0, oi, e.target.value)}
//                                                 onBlur={() => validateQuestion(0)}
//                                                 className="flex-1 rounded-lg border-[#dbdde6] dark:border-gray-700 dark:bg-[#111218] text-sm"
//                                                 type="text"
//                                                 placeholder={`Option ${oi + 1}`}
//                                             />
//                                             <button
//                                                 onClick={() => removeOption(0, oi)}
//                                                 className="text-red-500 p-1"
//                                             >
//                                                 <span className="material-symbols-outlined text-sm">delete</span>
//                                             </button>
//                                         </div>
//                                     ))}
//                                 </div>
//                                 {qErrors[0]?.options && <p className="mt-1 text-xs text-red-600">{qErrors[0].options}</p>}
//                             </div>
//                         )}
//                         <div className="space-y-4 pt-4 border-t border-[#dbdde6] dark:border-gray-800">
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-bold text-[#111218] dark:text-gray-200">Is Required</p>
//                                     <p className="text-xs text-[#616889] dark:text-gray-400">Candidate must answer to submit</p>
//                                 </div>
//                                 <label className="relative inline-flex items-center cursor-pointer">
//                                     <input
//                                         checked={questions[0]?.isRequired || false}
//                                         onChange={(e) => updateRow(0, { isRequired: e.target.checked })}
//                                         className="sr-only peer"
//                                         type="checkbox"
//                                     />
//                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
//                                 </label>
//                             </div>
//                             <div className="flex items-center justify-between">
//                                 <div>
//                                     <p className="text-sm font-bold text-[#111218] dark:text-gray-200">Is Knockout Question</p>
//                                     <p className="text-xs text-[#616889] dark:text-gray-400">Filter candidates based on answer</p>
//                                 </div>
//                                 <label className="relative inline-flex items-center cursor-pointer">
//                                     <input
//                                         checked={false} // Assuming not implemented yet
//                                         className="sr-only peer"
//                                         type="checkbox"
//                                     />
//                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
//                                 </label>
//                             </div>
//                         </div>
//                         <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30 space-y-4">
//                             <h4 className="text-xs font-black uppercase tracking-wider text-primary">Knockout Logic</h4>
//                             <div className="grid grid-cols-1 gap-4">
//                                 <div>
//                                     <label className="block text-xs font-bold text-[#616889] dark:text-gray-400 mb-2">Disqualify if answer</label>
//                                     <select className="w-full rounded-lg border-[#dbdde6] dark:border-gray-700 dark:bg-white dark:text-[#111218] focus:ring-primary focus:border-primary text-sm">
//                                         <option>is less than</option>
//                                         <option>is not equal to</option>
//                                         <option>does not contain</option>
//                                         <option>is one of</option>
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="block text-xs font-bold text-[#616889] dark:text-gray-400 mb-2">Value</label>
//                                     <input
//                                         className="w-full rounded-lg border-[#dbdde6] dark:border-gray-700 dark:bg-white dark:text-[#111218] focus:ring-primary focus:border-primary text-sm"
//                                         type="text"
//                                         value=""
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     </form>
//                 </div>
//                 <div className="p-6 border-t border-[#dbdde6] dark:border-gray-800 flex gap-3">
//                     <button
//                         onClick={onClose}
//                         className="flex-1 h-11 items-center justify-center rounded-lg bg-white dark:bg-gray-800 border border-[#dbdde6] dark:border-gray-700 px-4 text-[#111218] dark:text-white text-sm font-bold hover:bg-gray-50 transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={saveAll}
//                         disabled={loading || hasQErrors}
//                         className="flex-[2] h-11 items-center justify-center rounded-lg bg-primary text-white px-5 text-sm font-bold shadow-sm hover:opacity-90 transition-opacity"
//                     >
//                         Create Question
//                     </button>
//                 </div>
//             </div>

//             {/* Main Content */}
//             <div className="relative flex min-h-screen w-full flex-col group/design-root overflow-x-hidden">
//                 <div className="layout-container flex h-full grow flex-col">
//                     <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-[#dbdde6] dark:border-gray-800 bg-white dark:bg-[#111218] px-10 py-3 sticky top-0 z-50">
//                         <div className="flex items-center gap-8">
//                             <div className="flex items-center gap-4 text-primary">
//                                 <div className="size-6">
//                                     <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
//                                         <path clipRule="evenodd" d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z" fill="currentColor" fillRule="evenodd"></path>
//                                         <path clipRule="evenodd" d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z" fill="currentColor" fillRule="evenodd"></path>
//                                     </svg>
//                                 </div>
//                                 <h2 className="text-[#111218] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">AdminPanel</h2>
//                             </div>
//                             <nav className="flex items-center gap-6 ml-4">
//                                 <a className="text-[#616889] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">Jobs</a>
//                                 <span className="text-[#dbdde6] dark:text-gray-700">/</span>
//                                 <a className="text-[#616889] dark:text-gray-400 text-sm font-medium hover:text-primary transition-colors" href="#">Senior Product Designer</a>
//                                 <span className="text-[#dbdde6] dark:text-gray-700">/</span>
//                                 <span className="text-[#111218] dark:text-white text-sm font-bold">Screening Questions</span>
//                             </nav>
//                         </div>
//                         <div className="flex flex-1 justify-end gap-4">
//                             <button className="p-2 text-[#616889] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg">
//                                 <span className="material-symbols-outlined">notifications</span>
//                             </button>
//                             <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-[#dbdde6] dark:border-gray-700" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCohCVpnvcvg2pMqkBMLeAkPs1oVLfegGOAAtgA9OwozAlHN7pYerH7b4LAt3QMKQ3AmKsPTJGQHNM3dGD69HTjoZyH_MDWA-MiVXANOFioawSmE03vKeoJUUECkluHKJBaHhPH0ccG46ztmfleinlpVcDaH-PWldYSj58b59iSndsZPpKfwaDI0THZkm_pvD8WGg6-dq7U83G-_CHJ8CbgIJgAcLI_1cWhmbwbc_9LfPl6HegLqFgzfwfi78pEzRbgN0q_CLybhwub");' }}></div>
//                         </div>
//                     </header>
//                     <main className="flex flex-col items-center py-10 px-4 sm:px-10 lg:px-40">
//                         <div className="layout-content-container flex flex-col max-w-[900px] w-full gap-8">
//                             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
//                                 <div className="flex flex-col gap-1">
//                                     <div className="flex items-center gap-2 mb-1">
//                                         <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">Hiring workflow</span>
//                                     </div>
//                                     <h1 className="text-[#111218] dark:text-white text-3xl font-black leading-tight tracking-tight">Screening Questions for Senior Product Designer</h1>
//                                     <p className="text-[#616889] dark:text-gray-400 text-base">Define and order the questions candidates must answer during their application.</p>
//                                 </div>
//                                 <div className="flex gap-3 shrink-0">
//                                     <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-white dark:bg-gray-800 border border-[#dbdde6] dark:border-gray-700 px-4 text-[#111218] dark:text-white text-sm font-bold shadow-sm hover:bg-gray-50 transition-colors">
//                                         <span className="material-symbols-outlined text-lg">preview</span>
//                                         <span>Preview</span>
//                                     </button>
//                                     <button className="flex h-10 items-center justify-center gap-2 rounded-lg bg-primary text-white px-5 text-sm font-bold shadow-sm hover:opacity-90 transition-opacity">
//                                         <span>Save Changes</span>
//                                     </button>
//                                 </div>
//                             </div>
//                             <div className="flex flex-col gap-4">
//                                 {questions.slice(1).map((q, idx) => (
//                                     <div key={idx + 1} className="flex items-center gap-4 bg-white dark:bg-[#1a1e2e] border border-[#dbdde6] dark:border-gray-700 rounded-xl p-4 shadow-sm group hover:border-primary transition-colors">
//                                         <div className="drag-handle p-2 text-[#dbdde6] dark:text-gray-600 hover:text-primary transition-colors">
//                                             <span className="material-symbols-outlined">drag_indicator</span>
//                                         </div>
//                                         <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4">
//                                             <div className="flex flex-col gap-1">
//                                                 <div className="flex items-center gap-3">
//                                                     <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Q{idx + 2}</span>
//                                                     <h3 className="text-[#111218] dark:text-white font-semibold">{q.title || "Untitled Question"}</h3>
//                                                 </div>
//                                                 <div className="flex items-center gap-4 mt-2">
//                                                     <div className="flex items-center gap-1.5 text-xs font-medium text-[#616889] dark:text-gray-400">
//                                                         <span className="material-symbols-outlined text-sm">radio_button_checked</span>
//                                                         {q.inputType}
//                                                     </div>
//                                                     <div className="flex items-center gap-1.5 text-xs font-medium text-[#616889] dark:text-gray-400">
//                                                         <span className="material-symbols-outlined text-sm">{q.isRequired ? 'lock' : 'lock_open'}</span>
//                                                         {q.isRequired ? 'Required' : 'Optional'}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center gap-2">
//                                                 <button className="p-2 text-[#616889] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
//                                                     <span className="material-symbols-outlined text-xl">edit</span>
//                                                 </button>
//                                                 <button onClick={() => removeRow(idx + 1)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
//                                                     <span className="material-symbols-outlined text-xl">delete</span>
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                                 <button onClick={addRow} className="flex items-center justify-center gap-2 border-2 border-dashed border-[#dbdde6] dark:border-gray-700 rounded-xl p-8 text-[#616889] dark:text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all group mt-2">
//                                     <span className="material-symbols-outlined text-2xl group-hover:scale-110 transition-transform">add_circle</span>
//                                     <span className="text-lg font-bold">Add New Question</span>
//                                 </button>
//                             </div>
//                             <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-[#dbdde6] dark:border-gray-700 mt-4">
//                                 <div className="flex gap-4">
//                                     <div className="shrink-0 text-primary">
//                                         <span className="material-symbols-outlined text-3xl">lightbulb</span>
//                                     </div>
//                                     <div>
//                                         <h4 className="text-[#111218] dark:text-white font-bold text-sm mb-1">Pro Tip</h4>
//                                         <p className="text-[#616889] dark:text-gray-400 text-sm leading-relaxed">
//                                             Keep screening questions to a minimum (3-5 max) to ensure higher application completion rates. Drag and drop questions to reorder them based on logical flow.
//                                         </p>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className="flex items-center justify-between pt-6 border-t border-[#dbdde6] dark:border-gray-800 text-[#616889] dark:text-gray-500 text-xs font-medium">
//                                 <p>Modified by Admin: Today, 10:24 AM</p>
//                                 <div className="flex gap-6">
//                                     <a className="hover:text-primary transition-colors underline decoration-dotted" href="#">Version History</a>
//                                     <a className="hover:text-primary transition-colors underline decoration-dotted" href="#">Workflow Settings</a>
//                                 </div>
//                             </div>
//                         </div>
//                     </main>
//                     <button className="fixed bottom-8 right-8 size-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-[100]">
//                         <span className="material-symbols-outlined text-2xl">help</span>
//                     </button>
//                 </div>
//             </div>
//         </>
//     );
// }
