import React from "react";
import VacancyCard from "./VacancyCard";
import { useGetActiveJob } from "../jobs/hooks/useJobApi";

// 🔥 FIX 1: Add typing to helper function
const getStyleValue = (value: string | number | undefined): string | undefined => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

// 🔥 FIX 2: Add proper typing to component props
interface VacanciesProps {
  width?: string | number;
  height?: string | number;
}

const VacanciesSection: React.FC<VacanciesProps> = ({ width, height }) => {
  const { data: activeJob, isLoading, error } = useGetActiveJob();

  // API returns array
  const jobs = Array.isArray(activeJob) ? activeJob : [];

  return (
    <div
      style={{
        width: getStyleValue(width),
        height: getStyleValue(height),
      }}
      className="rounded-2xl bg-white p-4 border border-gray-200"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold">Current Vacancies</h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#E9EFF7] text-[#1270B0]">
            {jobs.length}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* 🔥 FIX 3: Add accessible name (does NOT change UI) */}
          <select className="text-sm border rounded-lg px-2 py-1" aria-label="Sort vacancies">
            <option>Popular</option>
            <option>Recent</option>
          </select>

          <button className="text-sm underline">See All</button>
        </div>
      </div>

      {isLoading && <p className="text-sm">Loading...</p>}
      {error && <p className="text-sm text-red-500">Something went wrong.</p>}

      <div className="grid md:grid-cols-2 gap-4">
        {jobs.map((job: any, index: number) => {
          const id = job._id || index;

          // 🔥 FIX 4: Convert objects → strings safely
          const company = job.category?.name || "Company Not Provided";
          const role = job.title || "Unknown Role";

          // 🔥 FIX 5: Add typing to skill mapping
          const tags: string[] = Array.isArray(job.skills)
            ? job.skills.map((s: any) =>
                typeof s === "string" ? s : s?.name || ""
              )
            : [];

          const salary = "";
          const location = "";
          const applicants = job.applicationsCount || 0;

          return (
            <VacancyCard
              key={id}
              id={id}
              company={company}
              role={role}
              tags={tags}
              salary={salary}
              location={location}
              applicants={applicants}
            />
          );
        })}
      </div>

      {!isLoading && jobs.length === 0 && (
        <p className="text-sm text-gray-500">No vacancies available.</p>
      )}
    </div>
  );
};

export default VacanciesSection;
