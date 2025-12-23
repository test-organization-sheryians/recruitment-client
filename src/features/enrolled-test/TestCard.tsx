import React from "react";
import { Enrollment } from "@/types/Enrollment";
import { BookOpen, Clock, Calendar } from "lucide-react";

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
    <div className="bg-white rounded-2xl border p-6 hover:shadow-xl transition">
      <div className="flex justify-between mb-4">
        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
          <BookOpen size={22} />
        </div>
      </div>

      <h2 className="font-bold text-lg">{test.title}</h2>

      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {test.summury}
      </p>

      <div className="flex gap-4 text-xs text-slate-500 mb-6">
        <span className="flex items-center gap-1">
          <Clock size={14} /> {test.duration} Min
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={14} />{" "}
          {new Date(createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* VIEW DETAILS BUTTON */}
      <button
        onClick={() => onViewDetails(test._id)}
        className="w-full py-3 text-blue-600 font-bold rounded-lg border border-blue-200 hover:bg-blue-50 transition"
      >
        View Details
      </button>
    </div>
  );
};
