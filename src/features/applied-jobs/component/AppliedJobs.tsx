"use client";

import { useState } from "react";
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Share2,
  CalendarClock,
} from "lucide-react";
import AppliedJobCard from "./AppliedJobCard";
import EmptyState from "./EmptyState";
import { useInfiniteAppliedJobs } from "@/features/candidate/jobs/hooks/useInfiniteJobs";
import { useIntersectionObserver } from "@/features/candidate/jobs/hooks/useIntersectionObserver";

const STATUS_CONFIG = {
  all: { label: "All Applications", icon: Briefcase, color: "gray" },
  shortlisted: { label: "Shortlisted", icon: CheckCircle, color: "emerald" },
  rejected: { label: "Rejected", icon: XCircle, color: "red" },
  forwareded: { label: "Forwarded", icon: Share2, color: "blue" },
  interview: { label: "Interview", icon: CalendarClock, color: "amber" },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

export default function AppliedJobs() {
  const [activeStatus, setActiveStatus] = useState<StatusKey>("all");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteAppliedJobs(null);

const pages = data?.pages ?? [];
const allJobs = pages.flatMap((p) => p.data ?? []);

const filteredJobs =
  activeStatus === "all"
    ? allJobs
    : allJobs.filter((job) => job.status === activeStatus);
  const totalCount = pages[0]?.pagination?.totalRecords ?? 0;

  const counts: Record<StatusKey, number> = {
  all: allJobs.length,
  shortlisted: allJobs.filter((j) => j.status === "shortlisted").length,
  rejected: allJobs.filter((j) => j.status === "rejected").length,
  forwareded: allJobs.filter((j) => j.status === "forwareded").length,
  interview: allJobs.filter((j) => j.status === "interview").length,
};

  const loadMoreRef = useIntersectionObserver({

    enabled: activeStatus === "all"&&hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  if (isLoading) return <p>Loading applied jobs...</p>;
  if (isError) return <p>Failed to load applied jobs</p>;
  if (allJobs.length === 0) return <EmptyState />;

  // const counts: Record<StatusKey, number> = {
  //   all: totalCount,
  //   shortlisted: totalCount,
  //   rejected: totalCount,
  //   forwareded: totalCount,
  //   interview: totalCount,
  // };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white rounded-xl p-4 sm:p-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
          <Briefcase className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">Job Applications</h2>
          <p className="text-sm text-gray-600">
            Track and manage all your job applications
          </p>
        </div>
      </div>

      {/* Status Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
          {(Object.keys(STATUS_CONFIG) as StatusKey[]).map((key) => {
            const cfg = STATUS_CONFIG[key];
            return (
              <StatusBox
                key={key}
                label={cfg.label}
                value={counts[key]}
                icon={cfg.icon}
                color={cfg.color}
                active={activeStatus === key}
                onClick={() => setActiveStatus(key)}
              />
            );
          })}
        </div>
      </div>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredJobs.map((job) => (
          <AppliedJobCard key={job._id} job={job} />
        ))}
      </div>

      {/* 👇 Infinite scroll trigger */}
      <div ref={loadMoreRef} className="h-10" />

      {isFetchingNextPage && (
        <p className="text-center text-sm text-gray-500">
          Loading more jobs...
        </p>
      )}
    </div>
  );
}

/* ---------------- StatusBox ---------------- */

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
      className={`flex items-center justify-between rounded-lg p-4 border transition-all
        ${
          active
            ? "border-blue-400 bg-blue-50"
            : "border-gray-200 bg-white hover:bg-blue-50"
        }`}
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
