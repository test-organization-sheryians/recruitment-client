import React from "react";

type Size = number | string;

interface ApplicantsListProps {
  height?: Size;
  width?: Size;
  className?: string;
}

interface Applicant {
  id: string; // added for proper key
  name: string;
  email: string;
  role: string;
  date: string;
  experience: string;
  status: "Interviewing" | "Shortlisted" | "Scheduled";
}

const rows: Applicant[] = [
  { id: "1", name: "Debasish Nayak", email: "dev@gmail.com", role: "Frontend Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Interviewing" },
  { id: "2", name: "Daneshwar Verma", email: "danish@gmail.com", role: "Backend Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Shortlisted" },
  { id: "3", name: "Sarthak Choudhary", email: "dev@gmail.com", role: "Frontend Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Interviewing" },
  { id: "4", name: "Arsh Rai", email: "arsh@gmail.com", role: "Full Stack Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Shortlisted" },
  { id: "5", name: "Pranita", email: "pranita@gmail.com", role: "Frontend Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Scheduled" },
  { id: "6", name: "Dipak Wagh", email: "dipak@gmail.com", role: "Frontend Dev.", date: "Oct 15, 2025", experience: "0-1 years", status: "Interviewing" },
];

const statusConfig = {
  Interviewing: { color: "yellow", label: "Interviewing" },
  Shortlisted: { color: "emerald", label: "Shortlisted" },
  Scheduled: { color: "violet", label: "Scheduled" },
} as const;

export default function ApplicantsList({
  height = 520,
  width = 840,
  className = "",
}: ApplicantsListProps) {
  const heightValue = typeof height === "number" ? `${height}px` : height;
  const widthValue = typeof width === "number" ? `${width}px` : width;

  return (
    <div
      className={`bg-white rounded-2xl shadow-md p-6 flex flex-col overflow-hidden ${className}`}
      style={{
        height: heightValue,
        width: widthValue,
        maxHeight: heightValue,
        maxWidth: widthValue,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Applicants List</h2>
          <span className="px-3 py-1 rounded-full text-white text-xs font-bold bg-blue-600">
            1,124
          </span>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Sort by:</span>
            <select
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="latest"
            >
              <option value="latest">Latest</option>
              <option value="popular">Popular</option>
              <option value="name">Name</option>
            </select>
          </label>

          <button className="rounded-xl border border-gray-300 bg-white px-5 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition">
            See All
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-gray-200 mb-4">
        {["All Applicants", "Screening", "Shortlisted", "Interviewing", "Job Offers"].map((tab) => (
          <button
            key={tab}
            className={`relative pb-4 text-sm font-semibold transition ${
              tab === "All Applicants"
                ? "text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1 after:bg-blue-600 after:rounded-t"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-y-auto h-full">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-200">
              <tr className="grid grid-cols-12 text-left text-xs font-semibold text-gray-600">
                <th className="col-span-3 pl-6 py-4">Name</th>
                <th className="col-span-2">Role</th>
                <th className="col-span-2">Date</th>
                <th className="col-span-2">Experience</th>
                <th className="col-span-1">Resume</th>
                <th className="col-span-2 pr-6">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((applicant) => {
                const status = statusConfig[applicant.status];
                return (
                  <tr
                    key={applicant.id}
                    className="grid grid-cols-12 items-center hover:bg-gray-50 transition py-3"
                  >
                    <td className="col-span-3 pl-6">
                      <div className="font-medium text-gray-900">{applicant.name}</div>
                      <div className="text-sm text-gray-500">{applicant.email}</div>
                    </td>
                    <td className="col-span-2 text-gray-700">{applicant.role}</td>
                    <td className="col-span-2 text-gray-700">{applicant.date}</td>
                    <td className="col-span-2 text-gray-700">{applicant.experience}</td>
                    <td className="col-span-1">
                      <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition">
                        <span role="img" aria-label="document">Resume</span>
                        Resume
                      </button>
                    </td>
                    <td className="col-span-2 pr-6">
                      <span className={`inline-flex items-center gap-2 text-${status.color}-600 font-semibold`}>
                        <span
                          className={`h-2 w-2 rounded-full bg-${status.color}-500`}
                          aria-hidden="true"
                        />
                        {status.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}