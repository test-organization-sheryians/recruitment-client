import React from "react";

type Size = number | string;

type ApplicantsListProps = {
  height?: Size; 
  width?: Size;  
  className?: string;
};

type Applicant = {
  name: string;
  email: string;
  role: string;
  date: string;
  experience: string;
  status: "Interviewing" | "Shortlisted" | "Scheduled";
};

const rows: Applicant[] = [
  { name: "Debasish Nayak",   email: "dev@gmail.com",   role: "Frontend Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Interviewing" },
  { name: "Daneshwar Verma",  email: "danish@gmail.com",role: "Backend Dev.",  date: "Oct 15, 2025", experience: "0-1 years", status: "Shortlisted" },
  { name: "Sarthak Choudhary",email: "dev@gmail.com",   role: "Frontend Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Interviewing" },
  { name: "Arsh Rai",         email: "arsh@gmail.com",  role: "Full Stack Dev.",date:"Oct 15, 2025", experience: "0-1 years", status: "Shortlisted" },
  { name: "Pranita",          email: "pranita@gmail.com",role:"Frontend Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Scheduled" },
  { name: "Dipak Wagh",       email: "dipak@gmail.com", role: "Frontend Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Interviewing" },
];

export default function ApplicantsList({
  height = 520,     
  width = 840,
  className = "",
}: ApplicantsListProps) {
  const h = typeof height === "number" ? `${height}px` : height;
  const w = typeof width === "number" ? `${width}px` : width;

  return (
    <div
      className={`h-[var(--h)] w-[var(--w)] bg-white rounded-2xl shadow-md p-4 flex flex-col overflow-hidden ${className}`}
      style={
        {
          ["--h"]: h,
          ["--w"]: w,
        } as React.CSSProperties
      }
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-lg font-semibold text-gray-900">Applicants Lists</span>
          <span className="px-3 py-1 rounded-full text-white text-xs font-semibold bg-blue-600">1124</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <span>Sort by:</span>
            <select
              className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-gray-700"
              defaultValue="popular"
              aria-label="Sort applicants"
            >
              <option value="popular">Popular</option>
              <option value="latest">Latest</option>
              <option value="name">Name</option>
            </select>
          </label>
          <button className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900">
            See All
          </button>
        </div>
      </div>

      <div className="mt-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-6">
          <button className="relative pb-3 text-sm font-semibold text-gray-900">
            All Applicants
            <span className="absolute left-0 right-0 -bottom-[2px] h-[3px] rounded bg-blue-600" />
          </button>
          <button className="pb-3 text-sm font-semibold text-gray-500">Screening</button>
          <button className="pb-3 text-sm font-semibold text-gray-500">Shortlisted</button>
          <button className="pb-3 text-sm font-semibold text-gray-500">Interviewing</button>
          <button className="pb-3 text-sm font-semibold text-gray-500">Job Offers</button>
        </div>
      </div>

      <div className="mt-3 border border-gray-200 rounded-xl overflow-hidden flex-1 flex flex-col">
       

        <div className="overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50">
              <tr className="grid grid-cols-[1.6fr_1.1fr_1fr_1fr_1fr_1fr] text-xs font-semibold text-gray-500 px-4 py-2">
                <th className="text-left">Name</th>
                <th className="text-left">Role</th>
                <th className="text-left">Date</th>
                <th className="text-left">Experience</th>
                <th className="text-left">Resume</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((r, idx) => (
                <tr
                  key={idx}
                  className="grid grid-cols-[1.6fr_1.1fr_1fr_1fr_1fr_1fr] items-center px-4 py-3"
                >
                  <td>
                    <div className="font-semibold text-gray-900">{r.name}</div>
                    <div className="text-xs text-gray-500">{r.email}</div>
                  </td>
                  <td className="text-gray-900">{r.role}</td>
                  <td className="text-gray-900">{r.date}</td>
                  <td className="text-gray-900">{r.experience}</td>
                  <td>
                    <button className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900">
                      <span aria-hidden>📄</span>
                      Resume
                    </button>
                  </td>
                  <td>
                    <span
                      className={[
                        "inline-flex items-center gap-2 font-semibold",
                        r.status === "Interviewing" && "text-yellow-600",
                        r.status === "Shortlisted" && "text-emerald-600",
                        r.status === "Scheduled" && "text-violet-600",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <span
                        className={[
                          "inline-block h-2 w-2 rounded-full",
                          r.status === "Interviewing" && "bg-yellow-500",
                          r.status === "Shortlisted" && "bg-emerald-500",
                          r.status === "Scheduled" && "bg-violet-500",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        aria-hidden
                      />
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
