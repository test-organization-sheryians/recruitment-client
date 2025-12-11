import React from "react";

interface VacancyCardProps {
  id: string;
  company: string;
  role: string;
  tags: string[];
  salary: string;
  location: string;
  applicants: number;
}

const VacancyCard: React.FC<VacancyCardProps> = ({
  company,
  role,
  tags,
  salary,
  location,
  applicants,
}) => {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-base font-semibold">{company}</h4>
          <p className="text-sm text-gray-600">{role}</p>
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
};

export default VacancyCard;
