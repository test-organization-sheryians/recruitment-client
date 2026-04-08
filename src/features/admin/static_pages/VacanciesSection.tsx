"use client";

import { useEffect, useMemo, useRef } from "react";
import VacancyCard, { JobData } from "./VacancyCard";
import type { Job } from "@/types/Job";

type ExtendedJob = Job & { applicantsCount?: number; salary?: number | string | null };
import { useInfiniteJobsAdmin } from "@/features/job-management/hooks/useJobApi";
import { Briefcase, Loader2, AlertCircle } from "lucide-react";

/* ===================== TYPES ===================== */

/* ===================== UTILS ===================== */

const getStyleValue = (value?: string | number) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

/* ===================== PROPS ===================== */

type VacanciesSectionProps = {
  width?: string | number;
  height?: string | number;
};

/* ===================== COMPONENT ===================== */

const VacanciesSection = ({ width, height }: VacanciesSectionProps) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteJobsAdmin();

  /* 🔥 FLATTEN ALL PAGES */
  const jobs: ExtendedJob[] = useMemo(
    () => data?.pages.flatMap((page) => page.data as ExtendedJob[]) ?? [],
    [data]
  );

  const normalizeJob = (job: ExtendedJob): JobData => {
    const skillsNormalized = Array.isArray(job.skills)
      ? job.skills.map((s) => (typeof s === "string" ? s : { _id: s._id, name: s.name }))
      : undefined;

    return {
      _id: job._id,
      title: job.title,
      education: job.education,
      skills: skillsNormalized,
      salary: job.salary === undefined || job.salary === null ? undefined : String(job.salary),
      location: job.location,
      applicantsCount: job.applicantsCount,
      createdAt: job.createdAt,
    };
  };

  /* 🔥 REFS */
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  /* 🔥 INFINITE SCROLL LOGIC */
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: scrollRef.current,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  /* ===================== STATES ===================== */

  if (isLoading) {
    return (
      <div
        style={{ width: getStyleValue(width), height: getStyleValue(height) }}
        className="bg-white rounded-3xl p-6 border flex items-center justify-center"
      >
        <Loader2 className="animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        style={{ width: getStyleValue(width), height: getStyleValue(height) }}
        className="bg-white rounded-3xl p-6 border flex items-center justify-center"
      >
        <AlertCircle className="text-red-400 mr-2" />
        <span className="text-red-500 text-sm">
          Failed to load vacancies
        </span>
      </div>
    );
  }

  /* ===================== UI ===================== */

  return (
    <div
      style={{ width: getStyleValue(width), height: getStyleValue(height) }}
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Current Vacancies
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Active job openings
          </p>
        </div>

        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
          {jobs.length}
        </span>
      </div>

      {/* Content */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-2 -mr-2 custom-scrollbar"
      >
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-2xl bg-gray-50">
            <Briefcase className="text-gray-300 mb-2" size={32} />
            <p className="text-sm font-semibold text-gray-500">
              No active vacancies
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 pb-4">
            {jobs.map((job) => (
              <VacancyCard key={job._id} data={normalizeJob(job)} />
            ))}
          </div>
        )}

        {/* Infinite Scroll Trigger */}
        <div
          ref={loadMoreRef}
          className="h-8 flex justify-center items-center"
        >
          {isFetchingNextPage && (
            <Loader2 className="animate-spin text-gray-400" size={18} />
          )}
        </div>
      </div>
    </div>
  );
};

export default VacanciesSection;
