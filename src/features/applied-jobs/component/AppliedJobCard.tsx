"use client";

import { Calendar, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppliedJob } from "../types/appliedjobs.types";

interface Props {
  job: AppliedJob;
}

/* ❌ hired removed */
const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  applied: {
    label: "Applied",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  rejected: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  forwarded: {
    label: "Forwarded",
    className: "bg-purple-100 text-purple-700 border-purple-200",
  },
  interview: {
    label: "Interview",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
};

export default function AppliedJobCard({ job }: Props) {
  const router = useRouter();

 
  const status =
    STATUS_CONFIG[job.status] ?? {
      label: job.status || "Not specified",
      className: "bg-gray-100 text-gray-700 border-gray-200",
    };

  return (
    <div
      onClick={() => {
       
        if (job.jobId) {
          router.push(`/job-details?id=${job.jobId}`);
        }
      }}
      className="w-full cursor-pointer"
    >
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">

        {/* HEADER */}
        <div className="flex justify-between items-start gap-2 mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
            {job.jobTitle || "Not specified"}
          </h3>

          <span
            className={`px-3 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${status.className}`}
          >
            {status.label}
          </span>
        </div>

        {/* META */}
        <div className="flex flex-col gap-2 text-sm text-gray-600">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span className="leading-snug">
              {job.location
                ? `${job.location.city}, ${job.location.state}, ${job.location.country} - ${job.location.pincode}`
                : "Not specified"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 shrink-0" />
            <span>
              {job.createdAt
                ? new Date(job.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Not specified"}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
