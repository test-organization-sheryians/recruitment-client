import React from "react";
import VacancyCard from "./VacancyCard";

interface Vacancy {
  id: string;
  company: string;
  role: string;
  tags: string[];
  salary: string;
  location: string;
  applicants: number;
}

const VACANCIES: Vacancy[] = [
  {
    id: "v1",
    company: "Sheryians Coding School",
    role: "Frontend Developer",
    tags: ["React.js", "TypeScript", "etc"],
    salary: "6.6 LPA – 7.8 LPA",
    location: "Bhopal, India",
    applicants: 129,
  },
  {
    id: "v2",
    company: "Slice",
    role: "Backend Developer",
    tags: ["Node.js", "TypeScript", "Express"],
    salary: "6.6 LPA – 7.8 LPA",
    location: "India",
    applicants: 129,
  },
  {
    id: "v3",
    company: "PhonePe",
    role: "Backend Developer",
    tags: ["Node.js", "TypeScript", "etc"],
    salary: "6.6 LPA – 7.8 LPA",
    location: "India",
    applicants: 129,
  },
];
const getStyleValue = (value: string | number | undefined) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const VacanciesSection: React.FC<{
  width?: string | number;
  height?: string | number;
}> = ({ width, height }) => {
  return (
    <div
      style={{
        width: getStyleValue(width),
        height: getStyleValue(height),
      }}
      className='rounded-2xl bg-white p-4 border border-gray-200'
    >
      <div className='mb-4 flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <h3 className='text-lg font-semibold'>Current Vacancies</h3>
          <span className='text-xs px-2 py-0.5 rounded-full bg-[#E9EFF7] text-[#1270B0]'>
            104
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

      <div className='grid md:grid-cols-2 gap-4'>
        {VACANCIES.map((v) => (
          <VacancyCard key={v.id} {...v} />
        ))}
      </div>
    </div>
  );
};
export default VacanciesSection;
