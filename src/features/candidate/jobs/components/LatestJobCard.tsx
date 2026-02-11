"use client";

import { MapPin, Clock } from "lucide-react";
import JobIcon from "./jobIcon";

interface LatestJobCardProps {
  jobId: string;
  title: string;
  company: string;
  location?: string;
  salary?: {
  currency?: string;
  min?: number;
  max?: number;
};



  postedAt?: string;
  skills?: string[];
  applied?: boolean;
  onDetails: (jobId: string) => void;
  onApply: (jobId: string) => void;
}


export default function LatestJobCard({
  jobId,
  title,
  company,
  location = "Remote",
  salary,
  postedAt,
  skills = [],
  applied = false,
  onDetails,
  onApply,
}: LatestJobCardProps) {
  const visibleSkills = skills.slice(0, 4);
  const extraSkills = skills.length - visibleSkills.length;

  

  return (
   <div className="bg-white rounded-lg p-6 flex flex-col md:flex-row md:justify-between border gap-6 
                hover:shadow-lg hover:shadow-gray-500/50 
                transition-shadow duration-300">

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

          <p className="text-base font-bold text-gray-700 mt-0.5">
            {company}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-5 mt-2 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin size={15} />
              {location}
            </span>

          {salary && salary.min != null && salary.max != null && (
         <span className="flex items-center gap-1">
    💰 {salary.currency ?? "₹"} {salary.min} - {salary.max}
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
                    ? "bg-blue-50 text-blue-600 font-bold"
                    : "bg-gray-100 text-gray-700 font-bold"
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

      {/* BUTTONS - BELOW ON MOBILE, RIGHT ON DESKTOP */}
      <div className="flex flex-row md:flex-col md:justify-center gap-4">
d         <button
  onClick={() => onDetails(jobId)}
  className="px-8 py-3 border border-blue-600 text-[16px] text-blue-600 rounded-lg font-bold hover:bg-blue-50"
>
  Details
</button>

<button
  disabled={applied}
  onClick={(e) => {
    e.stopPropagation()
    onApply(jobId)
  }}
  className={`px-8 py-3 rounded-lg text-[16px] font-bold ${
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
