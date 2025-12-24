"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ===================== TYPES ===================== */

type Skill =
  | string
  | {
    _id?: string;
    name?: string;
  };

type Location = {
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  _id?: string;
};

export type JobData = {
  _id?: string;
  title?: string;
  education?: string;
  skills?: Skill[];
  salary?: string;
  location?: Location;
  applicantsCount?: number;
  createdAt?: string;
};

interface VacancyCardProps {
  data?: JobData;
}

/* ===================== COMPONENT ===================== */

export default function VacancyCard({ data }: VacancyCardProps) {
  // ✅ All hooks must be called unconditionally at the top
  const router = useRouter();
  const [showAllSkills, setShowAllSkills] = useState(false);

  // ✅ useMemo now called unconditionally (safe because we check data inside)
  const skillNames = useMemo<string[]>(() => {
    if (!data?.skills || !Array.isArray(data.skills)) return [];

    return data.skills
      .map((s) => {
        if (typeof s === "string") return s.trim();
        if (s && typeof s === "object" && s.name) return s.name.trim();
        return null;
      })
      .filter(Boolean) as string[];
  }, [data?.skills]); // Note: data?.skills to avoid deep dependency issues

  // ✅ Early return AFTER all hooks
  if (!data) {
    return null;
  }

  const visibleSkills = skillNames.slice(0, 3);
  const hiddenSkills = skillNames.slice(3);

  const handleCardClick = () => {
    if (data._id) {
      router.push(`/admin/applicants/${data._id}`);
    }
  };

  const handleToggleSkills = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAllSkills((prev) => !prev);
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        group rounded-2xl border border-gray-200 bg-white p-4
        cursor-pointer transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5
        select-none
      "
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {data.title ?? "Untitled Job"}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {data.education ?? "Education not specified"}
          </p>
        </div>

        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium whitespace-nowrap">
          {data.createdAt
            ? new Date(data.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })
            : "Recent"}
        </span>
      </div>

      {/* ================= SKILLS ================= */}
      {skillNames.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {visibleSkills.map((skill, idx) => (
            <span
              key={`${skill}-${idx}`}
              className="
                text-[11px] px-2.5 py-1 rounded-full
                bg-gray-100 text-gray-700
                group-hover:bg-blue-50 group-hover:text-blue-700
                transition-colors duration-200
              "
            >
              {skill}
            </span>
          ))}

          {hiddenSkills.length > 0 && (
            <button
              onClick={handleToggleSkills}
              className="
                text-[11px] px-2.5 py-1 rounded-full
                bg-blue-100 text-blue-700 font-semibold
                hover:bg-blue-200 transition-colors duration-200
              "
            >
              {showAllSkills ? "− Less" : `+${hiddenSkills.length}`}
            </button>
          )}
        </div>
      )}

      {/* ================= EXPANDED SKILLS ================= */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${showAllSkills ? "max-h-40 opacity-100 mt-3" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-wrap gap-2 pt-1">
          {hiddenSkills.map((skill, idx) => (
            <span
              key={`hidden-${idx}`}
              className="
                text-[11px] px-2.5 py-1 rounded-full
                bg-blue-50 text-blue-700
              "
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ================= APPLICANTS COUNT ================= */}
      <div className="mt-4">
        <div className="
  flex items-center justify-between
  rounded-xl bg-gray-50 px-4 py-3
  border border-gray-200
">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="text-sm">👥</span>
            Applicants
          </div>

          <span className="
    rounded-full bg-white px-3 py-1
    text-sm font-semibold text-gray-800
    shadow-sm tabular-nums
  ">
            {data.applicantsCount ?? 0}
          </span>
        </div>

      </div>
    </div>
  );
}