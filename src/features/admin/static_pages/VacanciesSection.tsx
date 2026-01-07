"use client";

import React from "react";
import VacancyCard, { JobData } from "./VacancyCard";
import { useGetJobs } from "../jobs/hooks/useJobApi";
import { Briefcase, Loader2, AlertCircle } from "lucide-react";

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
      <div 
        style={{
          width: getStyleValue(width),
          height: getStyleValue(height),
        }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center"
      >
        <Loader2 className="animate-spin text-gray-400 mb-2" size={24} />
        <span className="text-sm text-gray-500">Loading vacancies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        style={{
          width: getStyleValue(width),
          height: getStyleValue(height),
        }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center justify-center"
      >
        <AlertCircle className="text-red-400 mb-2" size={24} />
        <span className="text-sm text-red-500">Failed to load vacancies</span>
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
      className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Current Vacancies</h2>
          <p className="text-xs text-gray-400 font-medium mt-1">Active job openings</p>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-semibold">
            {jobs.length}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar -mr-2 pt-2">
        {jobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
            <Briefcase size={32} className="text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-500">No active vacancies</p>
            <p className="text-xs text-gray-400">Create your first job posting</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 pb-2">
            {jobs.map((job) => (
              <VacancyCard key={job._id} data={job} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #f1f5f9; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default VacanciesSection;
