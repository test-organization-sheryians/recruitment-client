"use client";

import { MapPin, Clock, Bookmark } from "lucide-react";
import JobIcon from "./jobIcon";

interface LatestJobCardProps {
  title: string;
  company: string;
  location?: string;
  salary?: string;
  postedAt?: string;
  skills?: string[];
  applied?: boolean;
}

export default function LatestJobCard({
  title,
  company,
  location = "Remote",
  salary,
  postedAt,
  skills = [],
  applied = false,
}: LatestJobCardProps) {
  const visibleSkills = skills.slice(0, 4);
  const extraSkills = skills.length - visibleSkills.length;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 flex justify-between gap-6 hover:border-blue-500 transition">
      {/* LEFT */}
      <div className="flex gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
          <JobIcon name={title} className="w-6 h-6" />
        </div>

        {/* Info */}
        <div>
          <h3 className="text-lg font-semibold text-blue-600">
            {title}
          </h3>

          <p className="text-sm font-medium text-gray-800">
            {company}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={14} />
              {location}
            </span>

            {salary && (
              <span className="flex items-center gap-1">
                💰 {salary}
              </span>
            )}

            {postedAt && (
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {postedAt}
              </span>
            )}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-3">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600"
              >
                {skill}
              </span>
            ))}

            {extraSkills > 0 && (
              <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                +{extraSkills}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col items-end gap-3">
        <Bookmark className="text-gray-400 hover:text-blue-600 cursor-pointer" />

        <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-50">
          Details
        </button>

        <button
          disabled={applied}
          className={`px-6 py-2 rounded-lg text-sm font-medium ${
            applied
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {applied ? "Applied" : "Apply"}
        </button>
      </div>
    </div>
  );
}
