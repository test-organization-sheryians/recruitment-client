"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ChevronRight } from "lucide-react";

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
  const router = useRouter();
  const [showAllSkills, setShowAllSkills] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const skillNames = useMemo<string[]>(() => {
    if (!data?.skills || !Array.isArray(data.skills)) return [];

    return data.skills
      .map((s) => {
        if (typeof s === "string") return s.trim();
        if (s && typeof s === "object" && s.name) return s.name.trim();
        return null;
      })
      .filter(Boolean) as string[];
  }, [data?.skills]);

  if (!data) {
    return null;
  }

  const visibleSkills = skillNames.slice(0, 3);
  const hiddenSkills = skillNames.slice(3);
  const isHovered = hoveredId === data._id;
  
  const getTimeAgo = () => {
    if (!data.createdAt) return "Recent";
    const now = new Date();
    const created = new Date(data.createdAt);
    const diffInDays = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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
      onMouseEnter={() => setHoveredId(data._id || null)}
      onMouseLeave={() => setHoveredId(null)}
      className={`
        group cursor-pointer transition-all duration-300
        p-4 rounded-2xl border
        ${isHovered ? 'bg-white border-blue-100 shadow-md transform -translate-y-1' : 'bg-gray-50 border-transparent'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h4 className={`text-sm font-bold line-clamp-2 transition-colors ${
            isHovered ? 'text-gray-900' : 'text-gray-700'
          }`}>
            {data.title ?? "Untitled Job"}
          </h4>
          {data.education && (
            <p className="text-xs text-gray-500 mt-0.5">{data.education}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 font-medium whitespace-nowrap">
            {getTimeAgo()}
          </span>
          <ChevronRight 
            size={16} 
            className={`text-gray-400 transition-all duration-300 ${
              isHovered ? 'text-blue-600 translate-x-1' : ''
            }`} 
          />
        </div>
      </div>

      {/* Skills */}
      {skillNames.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-2">
            {visibleSkills.map((skill, idx) => (
              <span
                key={`${skill}-${idx}`}
                className={`
                  text-xs px-2.5 py-1 rounded-full font-medium transition-colors duration-200
                  ${isHovered ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'}
                `}
              >
                {skill}
              </span>
            ))}

            {hiddenSkills.length > 0 && (
              <button
                onClick={handleToggleSkills}
                className="text-xs px-2.5 py-1 rounded-full font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors duration-200"
              >
                {showAllSkills ? "− Less" : `+${hiddenSkills.length}`}
              </button>
            )}
          </div>

          {/* Expanded Skills */}
          <div className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${showAllSkills ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}
          `}>
            <div className="flex flex-wrap gap-2 pt-1">
              {hiddenSkills.map((skill, idx) => (
                <span
                  key={`hidden-${idx}`}
                  className="text-xs px-2.5 py-1 rounded-full font-medium bg-blue-50 text-blue-700"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Applicants Count */}
      <div className={`
        flex items-center justify-between
        rounded-xl px-3 py-2 border transition-all duration-200
        ${isHovered ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
      `}>
        <div className="flex items-center gap-2">
          <Users size={14} className={isHovered ? 'text-blue-600' : 'text-gray-500'} />
          <span className={`text-xs font-medium ${isHovered ? 'text-blue-700' : 'text-gray-600'}`}>
            Applicants
          </span>
        </div>

        <span className={`
          text-sm font-bold tabular-nums
          ${isHovered ? 'text-blue-700' : 'text-gray-800'}
        `}>
          {data.applicantsCount ?? 0}
        </span>
      </div>
    </div>
  );
}