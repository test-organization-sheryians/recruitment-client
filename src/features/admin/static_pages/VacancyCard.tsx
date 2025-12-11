"use client"; // IMPORTANT when using router in Next.js

import React from "react";
import { useRouter } from "next/navigation";

interface VacancyCardProps {
  id: string;
  company: string;
  role: string;
  tags: string[];
  salary: string;
  location?: string;
  applicants: number;
}

export default function VacancyCard({
  id,
  company,
  role,
  tags,
  salary,
  location,
  applicants,
}: VacancyCardProps) {
  return (
    <div className='rounded-2xl border border-gray-200 p-4 bg-white hover:shadow-sm transition'>
      <div className='flex items-start justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-xl bg-gray-100 grid place-items-center overflow-hidden'>
            <span className='text-sm font-semibold'>🏢</span>
          </div>
          <div>
            <h4 className='text-sm font-semibold'>{role}</h4>
            <p className='text-xs text-gray-500'>{company}</p>
          </div>
        </div>

        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">
          {applicants} Applicants
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        {tags?.map((tag, i) => (
          <span
            key={i}
            className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 flex justify-between text-sm text-gray-700">
        <span>{salary}</span>
        <span>{location}</span>
      </div>
    </div>
  );
}