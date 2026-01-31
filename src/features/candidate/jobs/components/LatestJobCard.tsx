"use client";

import { MapPin, Clock } from "lucide-react";
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
    <div className="bg-white rounded-2xl p-6 flex justify-between gap-6">
      {/* LEFT */}
      <div className="flex gap-4">
        {/* Icon */}
        <div className="w-14 h-14 rounded-lg bg-gray-50 flex items-center justify-center">
          <JobIcon name={title} className="w-7 h-7 text-blue-700" />
        </div>

        {/* Info */}
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {title}
          </h3>

          <p className="text-sm text-gray-700 mt-0.5">
            {company}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={15} />
              {location}
            </span>

            {salary && (
              <span className="flex items-center gap-1">
                💰 {salary}
              </span>
            )}

            {postedAt && (
              <span className="flex items-center gap-1">
                <Clock size={15} />
                {postedAt}
              </span>
            )}
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-2 mt-4">
            {visibleSkills.map((skill, index) => (
              <span
                key={skill}
                className={`px-4 py-1 text-xs rounded-full ${
                  index === 0
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {skill}
              </span>
            ))}

            {extraSkills > 0 && (
              <span className="px-4 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                +{extraSkills}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex flex-col justify-center gap-3">
        <button className="px-7 py-2.5 border border-blue-600 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-50">
          Details
        </button>

        <button
          disabled={applied}
          className={`px-7 py-2.5 rounded-xl text-sm font-medium ${
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
