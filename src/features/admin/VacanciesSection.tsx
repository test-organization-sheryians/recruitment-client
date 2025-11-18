import React from "react";
import VacancyCard from "./VacancyCard";

// Proper typed vacancy data
export interface Vacancy {
  id: string;
  company: string;
  role: string;
  tags: string[];
  salary: string;
  location: string;
  applicants: number;
}

// Sample data – now properly typed!
const VACANCIES: Vacancy[] = [
  {
    id: "v1",
    company: "Sheryians Coding School",
    role: "Frontend Developer",
    tags: ["React.js", "TypeScript", "Tailwind"],
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
    tags: ["Node.js", "TypeScript", "MongoDB"],
    salary: "6.6 LPA – 7.8 LPA",
    location: "India",
    applicants: 129,
  },
];

// Helper to convert number → px safely
const getStyleValue = (value: string | number | undefined): string | undefined => {
  if (value == null) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

interface VacanciesSectionProps {
  width?: string | number;
  height?: string | number;
}

const VacanciesSection: React.FC<VacanciesSectionProps> = ({ width, height }) => {
  return (
    <div
      style={{
        width: getStyleValue(width),
        height: getStyleValue(height),
      }}
      className="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm"
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-xl font-bold text-gray-900">Current Vacancies</h3>
          <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
            104
          </span>
        </div>

        <div className="flex items-center gap-4">
          <select className="text-sm border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>Popular</option>
            <option>Recent</option>
            <option>Salary</option>
          </select>
          <button className="text-sm font-medium text-blue-600 hover:underline">
            See All →
          </button>
        </div>
      </div>

      {/* Vacancy Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {VACANCIES.map((vacancy) => (
          <VacancyCard key={vacancy.id} {...vacancy} />
        ))}
      </div>
    </div>
  );
};

export default VacanciesSection;