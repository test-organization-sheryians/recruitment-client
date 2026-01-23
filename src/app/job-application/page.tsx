// "use client";

// import { useState } from "react";
// import { Star, User } from "lucide-react";

// export default function JobApplicationPage() {
//   /* -----------------------------
//      DYNAMIC DATA (MULTI-USER SAFE)
//      Later replace this with:
//      - AuthProvider data
//      - API / React Query
//   ------------------------------ */
//   const user = {
//     name: "Alex Rivera Very Long Name Example",
//     email: "alex.rivera.verylongemailaddress@examplecompany.com",
//   };

//   const job = {
//     title: "Senior Software Engineer",
//     department: "Engineering Team",
//     location: "San Francisco, CA (Remote)",
//   };

//   const [rating, setRating] = useState(4);

//   return (
//     <div className="min-h-screen bg-slate-100">
//       {/* ================= NAVBAR ================= */}
//       <header className="border-b bg-white">
//         <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
//           {/* Logo */}
//           <div className="flex items-center gap-2 font-semibold">
//             <div className="h-6 w-6 rounded bg-blue-700" />
//             <span className="text-sm sm:text-base">
//               Job Application Portal
//             </span>
//           </div>

//           {/* User Info (MULTI-USER SAFE) */}
//           <div className="flex items-center gap-3 max-w-[60%] sm:max-w-none">
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-200">
//               <User className="h-4 w-4 text-slate-600" />
//             </div>

//             <div className="min-w-0">
//               <p className="truncate text-sm font-medium text-slate-800">
//                 {user.name}
//               </p>
//               <p className="truncate text-xs text-slate-500">
//                 {user.email}
//               </p>
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* ================= CONTENT ================= */}
//       <main className="px-4">
//         {/* Job Header */}
//         <div className="mx-auto max-w-4xl py-6 text-center sm:py-10 md:text-left">
//           <h1 className="text-xl font-semibold sm:text-2xl md:text-3xl">
//             {job.title} Application
//           </h1>

//           <p className="mt-2 text-xs text-slate-500 sm:text-sm">
//             {job.department} · {job.location}
//           </p>
//         </div>

//         {/* Screening Card */}
//         <div className="mx-auto max-w-2xl rounded-xl border bg-white shadow-sm">
//           <div className="border-b px-6 py-4">
//             <h2 className="text-lg font-semibold">
//               Screening Questions
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Please answer the following questions carefully.
//             </p>
//           </div>

//           <div className="space-y-6 px-6 py-6">
//             {/* Rating */}
//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 How would you rate your experience with React and modern frontend frameworks? *
//               </label>

//               <div className="flex flex-wrap items-center gap-1">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <button
//                     key={i}
//                     type="button"
//                     onClick={() => setRating(i)}
//                   >
//                     <Star
//                       className={`h-6 w-6 ${
//                         i <= rating
//                           ? "fill-blue-600 text-blue-600"
//                           : "text-slate-300"
//                       }`}
//                     />
//                   </button>
//                 ))}

//                 <span className="ml-2 text-xs text-slate-500">
//                   {rating}/5 stars selected
//                 </span>
//               </div>
//             </div>

//             {/* Authorization */}
//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 Are you authorized to work in the United States? *
//               </label>

//               <div className="space-y-2 text-sm">
//                 <label className="flex items-center gap-2">
//                   <input type="radio" name="auth" defaultChecked />
//                   Yes, I am authorized to work
//                 </label>

//                 <label className="flex items-center gap-2">
//                   <input type="radio" name="auth" />
//                   No, I will require sponsorship
//                 </label>
//               </div>
//             </div>

//             {/* Start Date */}
//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 Earliest available start date *
//               </label>

//               <input
//                 type="date"
//                 className="w-full rounded-lg border px-3 py-2 text-sm"
//               />
//             </div>

//             {/* Textarea */}
//             <div>
//               <label className="mb-2 block text-sm font-medium">
//                 Why should we hire you for this role? *
//               </label>

//               <textarea
//                 rows={5}
//                 maxLength={500}
//                 placeholder="Describe your experience, skills, and impact..."
//                 className="w-full resize-none rounded-lg border px-3 py-2 text-sm"
//               />

//               <p className="mt-1 text-right text-xs text-slate-400">
//                 0 / 500 characters
//               </p>
//             </div>

//             {/* Actions */}
//             <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
//               <button className="rounded-lg border px-4 py-2 text-sm">
//                 Save as Draft
//               </button>

//               <button className="rounded-lg bg-blue-700 px-4 py-2 text-sm text-white hover:bg-blue-800">
//                 Submit Application
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="h-10" />
//       </main>
//     </div>
//   );
// }

















"use client";

import { useState } from "react";

export default function JobApplicationPage() {
  /* ---------- Dynamic (multi-user safe) ---------- */
  const user = {
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
  };

  const job = {
    title: "Senior Software Engineer Application",
    meta: "Engineering Team · San Francisco, CA (Remote)",
  };

  const [rating, setRating] = useState(4);

  // For character count in textarea
  const [text, setText] = useState("");

  // Star SVG - filled or outline depending on filled prop
  function StarIcon({ filled }: { filled: boolean }) {
    return filled ? (
      <svg
        className="h-8 w-8 fill-blue-600 text-blue-600"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        aria-hidden="true"
        fill="currentColor"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.538 1.118l-3.39-2.462a1 1 0 00-1.176 0l-3.39 2.462c-.783.57-1.838-.196-1.538-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z" />
      </svg>
    ) : (
      <svg
        className="h-8 w-8 text-slate-300"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.974a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.39 2.462a1 1 0 00-.364 1.118l1.287 3.974c.3.922-.755 1.688-1.538 1.118l-3.39-2.462a1 1 0 00-1.176 0l-3.39 2.462c-.783.57-1.838-.196-1.538-1.118l1.287-3.974a1 1 0 00-.364-1.118L2.045 9.4c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.974z"
        />
      </svg>
    );
  }

  // User avatar icon simplified (circle with user silhouette)
  const UserIcon = () => (
    <svg
      className="h-6 w-6 text-slate-600"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="7" r="4" />
      <path d="M5.5 21c0-3 5-4 6.5-4s6.5 1 6.5 4" />
    </svg>
  );

  // Arrow left for back button
  const ArrowLeftIcon = () => (
    <svg
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );

  // Calendar icon for date input
  const CalendarIcon = () => (
    <svg
      className="pointer-events-none absolute right-4 top-3 h-5 w-5 text-slate-400"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ================= NAVBAR ================= */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-8 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3 font-semibold text-slate-800 text-lg">
            <div className="h-7 w-7 rounded bg-blue-700" />
            Job Application Portal
          </div>

          {/* User */}
          <div className="flex items-center gap-4 max-w-[50%]">
            <div className="text-right leading-tight hidden sm:block min-w-0">
              <p className="truncate text-base font-medium">{user.name}</p>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
            </div>

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-200">
              <UserIcon />
            </div>
          </div>
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-1">
        {/* Job Title */}
        <div className="mx-auto max-w-3xl px-8 pt-12 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">{job.title}</h1>
          <p className="mt-3 text-base text-slate-500">{job.meta}</p>
        </div>

        {/* Screening Card */}
        <div className="mx-auto mt-10 max-w-2xl rounded-xl border bg-white shadow-sm">
          {/* Card Header */}
          <div className="border-b px-8 py-6">
            <h2 className="text-xl font-semibold text-slate-800">
              Screening Questions
            </h2>
            <p className="mt-2 text-base text-slate-500">
              Please answer the following questions to help us understand your
              background better.
            </p>
          </div>

          {/* Card Body */}
          <div className="space-y-10 px-8 py-8">
            {/* Rating */}
            <div>
              <label className="block text-base font-medium text-slate-800">
                How would you rate your experience level with React and modern
                frontend frameworks? <span className="text-red-500">*</span>
              </label>

              <div className="mt-4 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <button
                    key={i}
                    onClick={() => setRating(i)}
                    aria-label={`Rate ${i} stars`}
                    type="button"
                  >
                    <StarIcon filled={i <= rating} />
                  </button>
                ))}
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {rating}/5 stars selected (Expert)
              </p>
            </div>

            {/* Authorization */}
            <div>
              <label className="block text-base font-medium text-slate-800">
                Are you authorized to work in the United States?{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="mt-4 space-y-4">
                <label className="flex items-center gap-4 rounded-lg border px-6 py-4 text-base cursor-pointer">
                  <input
                    type="radio"
                    name="auth"
                    defaultChecked
                    className="accent-blue-600"
                  />
                  Yes, I am authorized to work in the United States
                </label>

                <label className="flex items-center gap-4 rounded-lg border px-6 py-4 text-base cursor-pointer">
                  <input type="radio" name="auth" className="accent-blue-600" />
                  No, I will require sponsorship in the future
                </label>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-base font-medium text-slate-800">
                When is your earliest available start date?{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative mt-4">
                <input
                  type="date"
                  className="w-full rounded-lg border px-6 py-3 text-base"
                />
                <CalendarIcon />
              </div>
            </div>

            {/* Textarea */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-base font-medium text-slate-800">
                  Why should we hire you for this role?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-sm text-slate-400">
                  {text.length} / 500 characters
                </span>
              </div>

              <textarea
                rows={6}
                maxLength={500}
                placeholder="Describe your relevant experience, key achievements, and what makes you a great fit..."
                className="mt-4 w-full resize-none rounded-lg border px-6 py-4 text-base"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mx-auto mt-10 flex max-w-2xl items-center justify-between px-8">
          <button
            className="flex items-center gap-3 text-base text-slate-600 hover:text-slate-800"
            type="button"
          >
            <ArrowLeftIcon />
            Back
          </button>

          <div className="flex gap-5">
            <button
              className="rounded-lg border px-6 py-3 text-base"
              type="button"
            >
              Save as Draft
            </button>
            <button
              className="rounded-lg bg-blue-700 px-8 py-3 text-base font-semibold text-white hover:bg-blue-800"
              type="submit"
            >
              Submit Application
            </button>
          </div>    
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="mt-16 border-t py-8 text-center text-sm text-slate-400">
        © 2024 TechCorp Recruiting Solutions. All rights reserved.
      </footer>
    </div>
  );
}















