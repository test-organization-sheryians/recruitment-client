"use client";

import { useState } from "react";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Share2,
  CalendarClock,
} from "lucide-react";
import { useAppliedJobs } from "../hooks/useAppliedJobs";
import AppliedJobCard from "./AppliedJobCard";
import EmptyState from "./EmptyState";


const STATUS_CONFIG = {
  all: {
    label: "All Applications",
    icon: Briefcase,
    color: "gray",
  },
  shortlisted: {
    label: "Shortlisted",
    icon: CheckCircle,
    color: "emerald",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    color: "red",
  },
  forwareded: {
    label: "Forwarded",
    icon: Share2,
    color: "blue",
  },
  interview: {
    label: "Interview",
    icon: CalendarClock,
    color: "amber",
  },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

export default function AppliedJobs() {
  const { data: jobs, isLoading, isError } = useAppliedJobs();
  const [activeStatus, setActiveStatus] = useState<StatusKey>("all");
  console.log("Applied Jobs:", jobs);

  if (isLoading) return <p>Loading applied jobs...</p>;
  if (isError) return <p>Failed to load applied jobs</p>;
  if (!jobs || jobs.length === 0) return <EmptyState />;

  const counts: Record<StatusKey, number> = {
    all: jobs.length,
    shortlisted: jobs.filter((j) => j.status === "shortlisted").length,
    rejected: jobs.filter((j) => j.status === "rejected").length,
    forwareded: jobs.filter((j) => j.status === "forwareded").length,
    interview: jobs.filter((j) => j.status === "interview").length,
  };

  
  const filteredJobs =
    activeStatus === "all"
      ? jobs
      : jobs.filter((job) => job.status === activeStatus);

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

     
      <div className="bg-white rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center shrink-0">
          <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
        </div>

        <div>
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
            Job Applications
          </h2>
          <p className="text-sm text-gray-600">
            Track and manage all your job applications in one place
          </p>
        </div>
      </div>

     
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {(Object.keys(STATUS_CONFIG) as StatusKey[]).map((key) => {
            const cfg = STATUS_CONFIG[key];
            const isActive = activeStatus === key;

            return (
              <StatusBox
                key={key}
                label={cfg.label}
                value={counts[key]}
                icon={cfg.icon}
                color={cfg.color}
                active={isActive}
                onClick={() => setActiveStatus(key)}
              />
            );
          })}
        </div>
      </div>

     
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.length === 0 ? (
          <EmptyState />
        ) : (
          filteredJobs.map((job) => (
            <AppliedJobCard key={job._id} job={job} />
          ))
        )}
      </div>
    </div>
  );
}



function StatusBox({
  label,
  value,
  icon: Icon,
  color,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  color: "gray" | "emerald" | "red" | "blue" | "amber";
  active: boolean;
  onClick: () => void;
}) {
  const colorMap = {
    gray: "text-gray-700 bg-gray-100",
    emerald: "text-emerald-600 bg-emerald-100",
    red: "text-red-600 bg-red-100",
    blue: "text-blue-600 bg-blue-100",
    amber: "text-amber-600 bg-amber-100",
  };

  return (
    <button
      onClick={onClick}
     className={`
  flex items-center justify-between rounded-lg p-4 border
  transition-all duration-200 cursor-pointer

  ${
    active
      ? "border-blue-400 bg-blue-50 shadow-sm"
      : "border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50"
  }
`}

    >
     
      <div className="flex flex-col text-left">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-xl font-bold">{value}</span>
      </div>

      
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}
      >
        <Icon className="w-5 h-5" />
      </div>
    </button>
  );
}
