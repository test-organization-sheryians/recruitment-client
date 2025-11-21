import React from "react";

export type Vacancy = {
  id: string;
  company: string;
  role: string;
  tags: string[];
  salary: string;
  location: string;
  applicants: number;
  postedLabel?: string;
};

export default function VacancyCard({
  company,
  role,
  tags,
  salary,
  location,
  applicants,
  postedLabel = "Posted",
}: Vacancy) {
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
        <span className='text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-600'>
          {postedLabel}
        </span>
      </div>

      <div className='mt-3 flex flex-wrap gap-2'>
        {tags.map((t) => (
          <span
            key={t}
            className='text-[11px] px-2 py-1 rounded-md bg-[#F5F7FA] text-gray-700'
          >
            {t}
          </span>
        ))}
      </div>

      <div className='mt-4 grid grid-cols-3 gap-2 text-[11px]'>
        <div className='px-2 py-1 rounded-lg bg-[#F5F7FA] text-gray-700'>
          <span className='block text-[10px] text-gray-500'>Job Offer</span>
          {salary}
        </div>
        <div className='px-2 py-1 rounded-lg bg-[#F5F7FA] text-gray-700'>
          <span className='block text-[10px] text-gray-500'>Location</span>
          {location}
        </div>
        <div className='px-2 py-1 rounded-lg bg-[#F5F7FA] text-gray-700'>
          <span className='block text-[10px] text-gray-500'>Applied</span>
          {applicants} Applicants
        </div>
      </div>
    </div>
  );
}