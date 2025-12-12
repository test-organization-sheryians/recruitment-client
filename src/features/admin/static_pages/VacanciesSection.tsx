
import React, { use } from "react";
import VacancyCard from "./VacancyCard";
import { useGetActiveJob } from "../jobs/hooks/useJobApi";

const getStyleValue = (value: string | number | undefined) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;

};

const VacanciesSection: React.FC<{
  width?: string | number;
  height?: string | number;
}> = ({ width, height }) => {

  const { data: activeJob, isLoading, error } = useGetActiveJob();

  console.log(activeJob, isLoading, error);

  return (
    <div
      style={{
        width: getStyleValue(width),
        height: getStyleValue(height),
      }}
      className='rounded-2xl bg-white p-4 border border-gray-200 flex flex-col'
    >
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-semibold'>Current Vacancies</h3>
          <span className='text-xs px-2 py-0.5 rounded-full bg-[#E9EFF7] text-[#1270B0]'>
            {Array.isArray(activeJob) ? activeJob.length : 0}
          </span>
        </div>
        <div className='flex items-center gap-3'>
          <select className='text-sm border rounded-lg px-2 py-1'>
            <option>Popular</option>
            <option>Recent</option>
          </select>
          <button className='text-sm underline'>See All</button>
        </div>
      </div>

      <div className='grid md:grid-cols-2 gap-4 overflow-y-auto flex-1 pr-2'>
        {Array.isArray(activeJob) && activeJob.map((job: any) => (
          <VacancyCard
            key={job._id}
            data={job}
          />
        ))}
      </div>
    </div>
  );
};
export default VacanciesSection;
