import { Briefcase, MapPin } from "lucide-react";

interface JobHeaderProps {
  title: string;
  company?: string;
  location?: string;
  salary?: string;
  postedTime?: string;
  logo?: string;
}

export default function JobHeader({
  title,
  company,
  location,
  salary,
  postedTime,
  logo,
}: JobHeaderProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
      <div className="flex items-start gap-4 mb-4">
        {/* Logo */}
        {logo ? (
          <img src={logo} alt={company} className="w-16 h-16 rounded-lg bg-gray-200" />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-300 flex items-center justify-center">
            <Briefcase size={32} className="text-gray-600" />
          </div>
        )}

        {/* Title, Company, Location */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
          
          {/* Company & Location Row */}
          <div className="flex items-center gap-4 mt-2 text-gray-600">
            {company && (
              <div className="flex items-center gap-1">
                <Briefcase size={18} className="text-blue-600" />
                <span className="font-medium text-gray-700">{company}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center gap-1">
                <MapPin size={18} className="text-blue-600" />
                <span>{location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Salary & Posted Time */}
      {(salary || postedTime) && (
        <div className="flex items-center gap-8 pt-4 border-t border-gray-200 mt-4">
          {salary && (
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Salary Range</p>
              <p className="font-bold text-blue-600 text-lg mt-1">{salary}</p>
            </div>
          )}
          {postedTime && (
            <div>
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">Posted</p>
              <p className="font-semibold text-gray-700 mt-1">{postedTime}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
