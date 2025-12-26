"use client";

import React from "react";
import VacancyCard, { JobData } from "./VacancyCard";
import { useGetJobs } from "../jobs/hooks/useJobApi";

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

const VacanciesSection: React.FC<VacanciesSectionProps> = ({
  width,
  height,
}) => {
  const { data: activeJobs, isLoading, error } = useGetJobs();

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-4 border border-gray-200">
        Loading vacancies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-white p-4 border border-gray-200 text-red-500">
        Failed to load vacancies
      </div>
    );
  }

  const jobs: JobData[] = Array.isArray(activeJobs) ? activeJobs : [];

  return (
    <div
      style={{
        width: getStyleValue(width),
        height: getStyleValue(height),
      }}
      className="rounded-2xl bg-white p-4 border border-gray-200 flex flex-col"
    >
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Current Vacancies</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E9EFF7] text-[#1270B0]">
            {jobs.length}
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-4 overflow-y-auto flex-1 pr-2">
        {jobs.map((job) => (
          <VacancyCard key={job._id} data={job} />
        ))}

        {jobs.length === 0 && (
          <div className="col-span-full text-center text-sm text-gray-500">
            No active vacancies found.
          </div>
        )}
      </div>
    </div>
  );
};

export default VacanciesSection;
