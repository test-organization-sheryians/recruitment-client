import React from "react";
import { Enrollment } from "@/types/Enrollment";
import { Clock, Calendar, ChevronRight, BookOpen } from "lucide-react";

interface Props {
  enrollment: Enrollment;
  onViewDetails: (testId: string) => void;
}

export const TestCard: React.FC<Props> = ({
  enrollment,
  onViewDetails,
}) => {
  const { test, createdAt } = enrollment;

  return (
    <div
      onClick={() => onViewDetails(test._id)}
      className="group flex flex-col justify-between bg-white rounded-2xl border border-slate-200 cursor-pointer transition-all duration-300 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 overflow-hidden"
    >
      {/* TOP SECTION: Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg">
             <BookOpen size={20} strokeWidth={2.5} />
          </div>
          {/* Optional: You could put a status badge here if needed */}
        </div>

        <h2 className="font-bold text-lg text-slate-800 mb-2 tracking-tight group-hover:text-blue-600 transition-colors">
          {test.title}
        </h2>

        <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
          {test.summury}
        </p>
      </div>

      {/* BOTTOM SECTION: Footer */}
      <div className="bg-[#f0f4f9] p-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        
        {/* Left: Metadata Group */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-400">
          <span className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">
            <Clock size={12} className="text-blue-500" />
            {test.duration}m
          </span>
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {new Date(createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Right: Text Link with Micro-interaction */}
        <button
          className="flex items-center gap-1 text-sm font-semibold text-slate-600 group-hover:text-blue-600 transition-colors"
        >
          View Details
          <ChevronRight
            size={16}
            className="text-slate-400 group-hover:text-blue-600 transition-all duration-300 group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
};