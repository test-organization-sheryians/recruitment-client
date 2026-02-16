"use client";

import { useState } from "react";

/* ---------------- Types ---------------- */

type ReportReason = "spam" | "fake" | "wrong_info" | "other";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
}

/* ---------------- Dummy Jobs ---------------- */

const JOBS: Job[] = [
  {
    id: "job-101",
    title: "Frontend Developer",
    company: "TechNova",
    location: "Remote",
  },
  {
    id: "job-102",
    title: "Backend Developer",
    company: "CodeSphere",
    location: "Bangalore",
  },
  {
    id: "job-103",
    title: "Full Stack Engineer",
    company: "DevHub",
    location: "Delhi",
  },
];

/* ---------------- Component ---------------- */

export default function JobReportDemo() {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [reason, setReason] = useState<ReportReason>("spam");
  const [description, setDescription] = useState("");

  const handleSubmit = () => {
    console.log("Reported:", {
      jobId: selectedJob?.id,
      reason,
      description,
    });

    alert("Report submitted successfully!");
    setSelectedJob(null);
    setDescription("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="mb-8 text-3xl font-bold text-center">Job Listings</h1>

      {/* ---------------- Job Cards ---------------- */}
      <div className="grid gap-6 md:grid-cols-3">
        {JOBS.map((job) => (
          <div
            key={job.id}
            className="rounded-xl bg-white p-6 shadow-md border"
          >
            <h2 className="text-lg font-semibold">{job.title}</h2>
            <p className="text-sm text-gray-600 mt-1">{job.company}</p>
            <p className="text-sm text-gray-500">{job.location}</p>

            <button
              onClick={() => setSelectedJob(job)}
              className="mt-4 rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
            >
              Report Job
            </button>
          </div>
        ))}
      </div>

      {/* ---------------- Modal ---------------- */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">
              Report: {selectedJob.title}
            </h2>

            {/* Reason */}
            <label className="block text-sm font-medium mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as ReportReason)}
              className="mb-3 w-full rounded border p-2"
            >
              <option value="spam">Spam</option>
              <option value="fake">Fake</option>
              <option value="wrong_info">Wrong Information</option>
              <option value="other">Other</option>
            </select>

            {/* Description */}
            <label className="block text-sm font-medium mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mb-4 w-full rounded border p-2"
              rows={3}
              placeholder="Explain the issue..."
            />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedJob(null)}
                className="rounded border px-4 py-2 text-sm"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="rounded bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
