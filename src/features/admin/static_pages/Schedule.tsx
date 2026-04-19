/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { useGetAllInterviews } from "@/features/admin/interviews/hooks/useInterviewApi";
import {
  Loader2,
  Mail,
  User,
  Briefcase,
  CalendarClock,
  AlertCircle,
  Phone,
  MapPin,
  Video,
  X,
} from "lucide-react";

interface EventItem {
  id: string;
  time: string;
  date: string;
  rawDate: Date;
  title: string;
  candidateName: string;
  recruiterEmail: string;
  status: string;
  originalData: any;
}

interface ScheduleProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

const formatTime = (date: Date) => {
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (date: Date) => {
  if (isNaN(date.getTime())) return "Invalid Date";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const getStyleValue = (value?: string | number) => {
  if (value === undefined) return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

const Schedule = ({ height, className = "" }: ScheduleProps) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("Today");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: rawData, isLoading, error } = useGetAllInterviews();

  const events = useMemo(() => {
    let interviews: any[] = [];

    if (Array.isArray(rawData)) {
      interviews = rawData;
    } else if (rawData && typeof rawData === "object") {
      if (Array.isArray((rawData as any).data))
        interviews = (rawData as any).data;
      else if (Array.isArray((rawData as any).interviews))
        interviews = (rawData as any).interviews;
    }

    if (interviews.length === 0) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return interviews
      .map((item: any) => {
        const rawDateString =
          item.timing || item.scheduledAt || item.date || item.createdAt;
        const dateObj = new Date(rawDateString || "");

        const title =
          item.jobId?.title ||
          item.jobTitle ||
          item.title ||
          "Untitled Position";

        const candidateName =
          (item.candidateId?.firstName
            ? `${item.candidateId.firstName} ${item.candidateId.lastName || ""}`
            : null) ||
          item.candidateName ||
          "Unknown Candidate";

        const recruiterEmail =
          item.interviewerEmail || item.recruiterEmail || "No Recruiter";

        return {
          id: item._id || Math.random().toString(),
          time: formatTime(dateObj),
          date: formatDate(dateObj),
          rawDate: dateObj,
          title,
          candidateName,
          recruiterEmail,
          status: item.status || "Scheduled",
          originalData: item,
        };
      })
      .filter((event: EventItem) => {
        if (isNaN(event.rawDate.getTime())) return true;

        switch (selectedFilter) {
          case "Today":
            return event.rawDate.toDateString() === today.toDateString();
          case "Tomorrow": {
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);
            return event.rawDate.toDateString() === tomorrow.toDateString();
          }
          case "All Upcoming":
            return event.rawDate >= today;
          default:
            return true;
        }
      })
      .sort(
        (a: EventItem, b: EventItem) =>
          a.rawDate.getTime() - b.rawDate.getTime(),
      );
  }, [rawData, selectedFilter]);

  const getModalTitle = (item: any) => item.jobId?.title || item.title || "N/A";
  const getModalCandidate = (item: any) =>
    (item.candidateId?.firstName
      ? `${item.candidateId.firstName} ${item.candidateId.lastName || ""}`
      : null) ||
    item.candidateName ||
    "N/A";

  const getModalDate = (item: any) => {
    const d = new Date(item.timing || item.scheduledAt || "");
    return isNaN(d.getTime()) ? new Date() : d;
  };

  const getLocation = (item: any) => {
    const loc = item.jobId?.location;
    if (!loc) return "";
    return [loc.city, loc.state, loc.country].filter(Boolean).join(", ");
  };

  return (
    <div
      className={`bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-gray-100 flex flex-col overflow-hidden ${className}`}
      style={{ height: getStyleValue(height) || "500px" }}
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between shrink-0">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 break-words">
            Interview Schedule
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-gray-400 font-medium break-words">
            Manage your upcoming meetings
          </p>
        </div>

        <div className="relative w-full sm:w-auto">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex w-full sm:w-auto items-center justify-center gap-2 px-3 py-2 bg-gray-50 hover:bg-white hover:shadow-sm border border-gray-100 rounded-xl text-sm font-semibold text-gray-600 transition-all"
          >
            <CalendarClock size={16} className="text-blue-500 shrink-0" />
            <span className="truncate">{selectedFilter}</span>
          </button>

          {isDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 overflow-hidden">
                {["Today", "Tomorrow", "All Upcoming"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setSelectedFilter(option);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      selectedFilter === option
                        ? "bg-blue-50 text-blue-600 font-semibold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden pr-1 sm:pr-2 custom-scrollbar -mr-1 sm:-mr-2 pt-2">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400">
            <Loader2 className="animate-spin mb-2" />
            <span className="text-xs">Loading schedule...</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs border border-red-100 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>Error loading interviews</span>
          </div>
        )}

        {!isLoading && events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50 px-4">
            <CalendarClock size={32} className="text-gray-300 mb-2" />
            <p className="text-sm font-semibold text-gray-500">
              No interviews found
            </p>
            <p className="text-xs text-gray-400">
              for {selectedFilter.toLowerCase()}
            </p>
          </div>
        ) : (
          <div className="space-y-4 pb-2">
            {events.map((event: EventItem) => {
              const isHovered = hoveredId === event.id;

              return (
                <div
                  key={event.id}
                  className="flex flex-col sm:flex-row gap-3 sm:gap-4 group cursor-pointer"
                  onMouseEnter={() => setHoveredId(event.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  onClick={() => {
                    setSelectedInterview(event.originalData);
                    setIsModalOpen(true);
                  }}
                >
                  <div className="sm:w-[4.5rem] w-full flex-shrink-0 flex sm:flex-col sm:items-end items-start pt-0 sm:pt-1 gap-2 sm:gap-0">
                    <span className="text-sm font-bold text-gray-900 leading-none">
                      {event.time}
                    </span>
                    <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">
                      {event.date}
                    </span>
                  </div>

                  <div className="hidden sm:flex flex-col items-center flex-shrink-0 relative">
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 z-10 border-[2px] border-white ring-1 transition-all duration-300 ${
                        isHovered
                          ? "bg-blue-600 ring-blue-200 scale-110"
                          : "bg-gray-300 ring-gray-100"
                      }`}
                    />
                    <div className="w-[2px] flex-1 bg-gray-100 my-1 group-last:bg-transparent rounded-full" />
                  </div>

                  <div className="flex-1 min-w-0 pb-1">
                    <div
                      className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                        isHovered
                          ? "bg-white border-blue-100 shadow-md -translate-y-0.5"
                          : "bg-gray-50 border-transparent"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isHovered
                                ? "bg-blue-50 text-blue-600"
                                : "bg-white text-gray-400"
                            }`}
                          >
                            <Briefcase size={14} />
                          </div>
                          <h3
                            className={`text-sm font-bold break-words leading-snug ${isHovered ? "text-gray-900" : "text-gray-700"}`}
                          >
                            {event.title}
                          </h3>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 pl-1 min-w-0">
                        <div className="flex items-start gap-2 text-xs font-medium text-gray-700 min-w-0">
                          <User
                            size={12}
                            className="text-gray-400 shrink-0 mt-0.5"
                          />
                          <span className="break-words whitespace-normal min-w-0">
                            Candidate: {event.candidateName}
                          </span>
                        </div>
                        <div className="flex items-start gap-2 text-xs text-gray-500 min-w-0">
                          <Mail
                            size={12}
                            className="text-gray-400 shrink-0 mt-0.5"
                          />
                          <span className="break-words whitespace-normal min-w-0">
                            Recruiter: {event.recruiterEmail}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && selectedInterview && (
        <div
          className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[95vw] sm:max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className={`h-2 w-2 rounded-full ${
                    (selectedInterview.status || "").toLowerCase() ===
                    "completed"
                      ? "bg-green-500"
                      : "bg-blue-500"
                  }`}
                />
                <span className="text-xs font-bold text-gray-600 uppercase tracking-wide truncate">
                  {selectedInterview.status || "Scheduled"}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-200 transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar">
              <div className="mb-6 min-w-0">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight break-words">
                  {getModalTitle(selectedInterview)}
                </h2>
                {getLocation(selectedInterview) && (
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1 break-words">
                    <MapPin size={14} /> {getLocation(selectedInterview)}
                  </p>
                )}
              </div>

              <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-100 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <div className="flex gap-4 items-center min-w-0">
                  <div className="bg-blue-100 text-blue-600 p-2.5 rounded-lg shrink-0">
                    <CalendarClock size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 break-words">
                      {getModalDate(selectedInterview).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        },
                      )}
                    </p>
                    <p className="text-xs text-blue-600 font-medium mt-0.5">
                      {getModalDate(selectedInterview).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "numeric",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>
                </div>

                {selectedInterview.meetingLink && (
                  <a
                    href={String(selectedInterview.meetingLink)}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
                  >
                    <Video size={14} /> Join
                  </a>
                )}
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 pb-2">
                  Candidate Details
                </h4>

                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-lg border border-gray-200 shrink-0">
                    <User size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base font-bold text-gray-900 break-words">
                      {getModalCandidate(selectedInterview)}
                    </p>
                    <p className="text-xs text-gray-500">Applicant</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {selectedInterview.candidateId?.email && (
                    <div className="flex items-start gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 min-w-0">
                      <Mail
                        size={14}
                        className="text-gray-400 shrink-0 mt-0.5"
                      />
                      <span className="break-words whitespace-normal">
                        {selectedInterview.candidateId.email}
                      </span>
                    </div>
                  )}
                  {(selectedInterview.candidateId?.phoneNumber ||
                    selectedInterview.candidateId?.phone) && (
                    <div className="flex items-start gap-3 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100 min-w-0">
                      <Phone
                        size={14}
                        className="text-gray-400 shrink-0 mt-0.5"
                      />
                      <span className="break-words whitespace-normal">
                        {selectedInterview.candidateId?.phoneNumber ||
                          selectedInterview.candidateId?.phone}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-[10px] text-gray-400 font-medium mb-2 uppercase">
                  Interviewer
                </p>
                <div className="flex flex-wrap items-center gap-3 bg-orange-50/50 p-3 rounded-lg border border-orange-100 w-full sm:w-fit">
                  <div className="h-6 w-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 text-[10px] font-bold shrink-0">
                    HR
                  </div>
                  <p className="text-xs font-medium text-gray-700 break-words">
                    {selectedInterview.interviewerEmail ||
                      selectedInterview.recruiterEmail ||
                      "Not Assigned"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e2e8f0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #cbd5e1;
        }
      `}</style>
    </div>
  );
};

export default Schedule;
