import React from "react";
import { Enrollment, TestAttempt } from "@/types/Enrollment";
import { X, Clock, Hash, Trophy, Activity } from "lucide-react";
import { DetailRow } from "./DetailRow";
import { SummaryBox } from "./SummaryBox";

interface Props {
  enrollment: Enrollment;
  attempts?: TestAttempt[];
  onClose: () => void;
}

export const TestModal: React.FC<Props> = ({ enrollment, attempts, onClose }) => {
  if (!enrollment.test) return null; // ✅ safeguard if test is missing

  const { title, summury, category, duration, passingScore, showResults } = enrollment.test;

  const latestAttempt = attempts?.[0];
  const attemptsCount = attempts?.length ?? 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white max-w-lg w-full rounded-3xl shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold">Test Details</h2>
          <button onClick={onClose}><X /></button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-medium text-lg">{title}</h3>
            <p className="text-sm text-slate-500">{summury}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <DetailRow icon={<Hash size={16} />} label="Category" value={category} />
            <DetailRow icon={<Clock size={16} />} label="Duration" value={`${duration} Min`} />
            <DetailRow icon={<Trophy size={16} />} label="Pass Score" value={passingScore} />
            <DetailRow icon={<Activity size={16} />} label="Results" value={showResults ? "Enabled" : "Disabled"} />
          </div>

          <div className="text-sm text-slate-500 font-medium mt-4">Attempts made: {attemptsCount}</div>

          {latestAttempt && showResults && (
            <div className="rounded-2xl border bg-slate-50 p-4 mt-2">
              <div className="flex justify-between mb-3">
                <p className="text-xs font-medium text-slate-400 uppercase">Attempt Summary</p>
                <span className={`text-xs font-medium px-3 py-1 rounded-full ${latestAttempt.isPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {latestAttempt.isPassed ? "Passed" : "Failed"}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <SummaryBox label="Score" value={latestAttempt.score} />
                <SummaryBox label="%" value={`${latestAttempt.percentage}%`} />
                <SummaryBox label="Time" value={`${latestAttempt.durationTaken ?? "--"} Min`} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
