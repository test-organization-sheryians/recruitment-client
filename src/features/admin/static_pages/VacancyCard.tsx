"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* ===================== TYPES ===================== */

type Skill =
  | string
  | {
      _id?: string;
      name: string;
    };

type Location = {
  city: string;
  state: string;
  country: string;
  pincode?: string;
  _id?: string;
};

export type JobData = {
  _id: string;
  title: string;
  education: string;
  skills: Skill[];
  salary: string;
  location: Location;
  applicantsCount: number;
  createdAt?: string;
};

interface VacancyCardProps {
  data: JobData;
}

/* ===================== COMPONENT ===================== */

export default function VacancyCard({ data }: VacancyCardProps) {
  const router = useRouter();
  const [showAllSkills, setShowAllSkills] = useState(false);

  /* ---------- Normalize skills ---------- */
  const skillNames = useMemo(
    () =>
      (data.skills || []).map((s) =>
        typeof s === "string" ? s : s.name
      ),
    [data.skills]
  );

  const visibleSkills = skillNames.slice(0, 3);
  const hiddenSkills = skillNames.slice(3);

  return (
  <div
      onClick={() => router.push(`/admin/applicants/${data._id}`)}
      className="
        group rounded-2xl border border-gray-200 bg-white p-4
        cursor-pointer transition-all duration-300
        hover:shadow-lg hover:-translate-y-0.5
      "
    >
      {/* ================= HEADER ================= */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          

          <div>
            <h4 className="text-sm font-semibold text-gray-900">
              {data.title}
            </h4>
            <p className="text-xs text-gray-500">{data.education}</p>
          </div>
        </div>

        <span className="text-[11px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium">
          {data.createdAt
            ? new Date(data.createdAt).toLocaleDateString()
            : "Recent"}
        </span>
      </div>

      {/* ================= SKILLS ================= */}
      <div className="mt-3 flex flex-wrap gap-2">
        {visibleSkills.map((skill) => (
          <span
            key={skill}
            className="
              text-[11px] px-2.5 py-1 rounded-full
              bg-gray-100 text-gray-700
              group-hover:bg-blue-50 group-hover:text-blue-700
              transition
            "
          >
            {skill}
          </span>
        ))}

        {hiddenSkills.length > 0 && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // 🚫 prevent card navigation
              setShowAllSkills((prev) => !prev);
            }}
            className="
              text-[11px] px-2.5 py-1 rounded-full
              bg-blue-100 text-blue-700 font-semibold
              hover:bg-blue-200 transition
            "
          >
            {showAllSkills ? "− Less" : `+${hiddenSkills.length}`}
          </button>
        )}
      </div>

      {/* ================= SLIDE-DOWN SKILLS ================= */}
      <div
        className={`
          overflow-hidden transition-all duration-300 ease-in-out
          ${showAllSkills ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}
        `}
      >
        <div className="flex flex-wrap gap-2 pt-1">
          {hiddenSkills.map((skill) => (
            <span
              key={skill}
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

      {/* ================= META INFO ================= */}
      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px]">
       
        <div className="rounded-xl bg-gray-50 px-3 py-1.5 min-w-[90px] text-center">
  <span className="block text-[10px] text-gray-500 whitespace-nowrap">👥 Applied
  </span>

  <span className="font-medium text-gray-700 tabular-nums">
    {data.applicantsCount} Applicants
  </span>
</div>
      </div>
    </div>  
  );
}
