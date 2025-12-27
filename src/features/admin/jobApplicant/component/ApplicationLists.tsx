"use client";

import { useState, useEffect } from "react";
import {
  useBulkUpdateApplicants,
  useJobApplicant,
  useJobInterviews,
} from "../hooks/useJobApplicant";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import PopupForm from "./PopupForm"; 
import { 
  ApplicantStatus, 
  ApplicantRow, 
  ApplicantsApiResponse 
} from "@/types/applicant";

/* ================= TYPES ================= */

type Size = number | string;

type ApplicantsListProps = {
  height?: Size;
  width?: Size;
  className?: string;
};

// Extended row for applicants
interface ExtendedApplicantRow extends Omit<ApplicantRow, 'id'> {
  id: string;             
  candidateUserId: string; 
  name: string;
  email: string;
  role: string;
  date: string;
  experience: string;
  status: ApplicantStatus;
  resume: string;
}

// Flat Type for Interview Table Display
interface InterviewRow {
  _id: string;
  candidateName: string;
  candidateEmail: string;
  interviewer: string;
  jobTitle: string;
  meetingLink: string;
  Timing: string; 
  status: string;
}

// RAW API Data coming from backend
interface InterviewApiData {
  _id: string;
  candidateId?: {
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  interviewerEmail?: string;
  meetingLink: string;
  timing: string;
  status: string;
}

/* ================= CONSTANTS ================= */

const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  forwareded: "bg-purple-100 text-purple-700",
  interview: "bg-orange-100 text-orange-700",
  hired: "bg-green-100 text-green-700",
  Scheduled: "bg-indigo-100 text-indigo-700", 
  Rescheduled: "bg-orange-100 text-orange-700",
  Cancelled: "bg-red-100 text-red-700",
};

const tabs: Array<"all" | ApplicantStatus> = [
  "all",
  "applied",
  "shortlisted",
  "rejected",
  "forwareded",
  "interview",
  "hired",
];

const ThreeDotsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 hover:text-gray-800">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM17.25 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
  </svg>
);

export default function ApplicantsList({
  height = "100%", // Default to full height
  width = "100%",
  className = "",
}: ApplicantsListProps) {
  // Use explicit style object for height/width
  const style = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
  };

  const { id } = useParams();
  const jobId = id as string;

  // 1. Fetch Applicants
  const { data } = useJobApplicant(jobId) as { data?: ApplicantsApiResponse };

  // 2. Fetch Interviews (Only when tab is 'interview')
  const [activeTab, setActiveTab] = useState<"all" | ApplicantStatus>("all");
  const { data: interviewResponse, isLoading: isInterviewsLoading } = useJobInterviews(
    jobId, 
    activeTab === "interview"
  );

  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<ApplicantStatus>("applied");
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [scheduleCandidateId, setScheduleCandidateId] = useState<string | null>(null);

  const { mutate, isPending } = useBulkUpdateApplicants();
  const { success, error } = useToast();

  // --- Handlers ---
  const toggleSelect = (appId: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(appId) ? prev.filter((x) => x !== appId) : [...prev, appId]
    );
  };

  const handleScheduleInterview = (candidateUserId: string) => {
    setScheduleCandidateId(candidateUserId);
    setIsPopupOpen(true);
    setActiveActionId(null);
  };

  const handleSubmit = () => {
    if (selectedApplicants.length === 0) {
      error("Please select at least one applicant");
      return;
    }
    mutate({ applicationIds: selectedApplicants, status: bulkStatus }, {
        onSuccess: () => {
          success("Applicants status updated successfully");
          setSelectedApplicants([]);
        },
        onError: () => error("Failed to update applicant status"),
      }
    );
  };

  // ==================== DATA MAPPING ====================

  // 1. Map Applicants
  const applicants: ExtendedApplicantRow[] = data?.applicants?.map((a) => ({
      id: a._id,
      candidateUserId: a.candidateDetails?._id || a.candidateId || "", 
      name: a.candidateDetails ? `${a.candidateDetails.firstName} ${a.candidateDetails.lastName}` : "Unknown",
      email: a.candidateDetails?.email || "No Email", 
      role: a.jobDetails?.title || "Unknown",
      date: new Date(a.appliedAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
      experience: a.jobDetails ? `${a.totalExperienceYears}-${a.jobDetails.requiredExperience} yrs` : `${a.totalExperienceYears} yrs`,
      status: a.status,
      resume: a.resumeUrl,
    })) ?? [];

  const filteredApplicants = activeTab === "all" ? applicants : applicants.filter((a) => a.status === activeTab);
  
  // 2. Map Interviews
  const rawInterviews = interviewResponse?.data || [];
  
  const interviews: InterviewRow[] = Array.isArray(rawInterviews) 
    ? rawInterviews.map((int: InterviewApiData) => ({
        _id: int._id,
        candidateName: int.candidateId ? `${int.candidateId.firstName} ${int.candidateId.lastName}` : "Unknown",
        candidateEmail: int.candidateId?.email || "Unknown",
        interviewer: int.interviewerEmail || "Unknown",
        jobTitle: "Job Role", 
        meetingLink: int.meetingLink,
        Timing: int.timing,
        status: int.status || "Scheduled"
      }))
    : [];

  // ==================== RENDER ====================

  const applicantGrid = "grid grid-cols-[0.4fr_1.6fr_1.1fr_1fr_1fr_1fr_1fr_0.5fr]";
  const interviewGrid = "grid grid-cols-[1.5fr_1.5fr_1.5fr_1.5fr_1fr_1fr]";

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col overflow-hidden ${className}`}
      style={style} // Apply dynamic height explicitly
      onClick={() => setActiveActionId(null)} 
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-lg font-semibold text-gray-900">
          {activeTab === 'interview' ? 'Scheduled Interviews' : 'Applicants Lists'}
        </span>

        {activeTab !== 'interview' && selectedApplicants.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as ApplicantStatus)}
              className="border rounded-xl px-2 py-1"
              onClick={(e) => e.stopPropagation()}
            >
              {tabs.filter((t) => t !== "all").map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button
              onClick={(e) => { e.stopPropagation(); handleSubmit(); }}
              disabled={isPending}
              className={`rounded-xl px-3 py-2 text-sm font-semibold text-white ${isPending ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"}`}
            >
              {isPending ? "Updating..." : `Submit (${selectedApplicants.length})`}
            </button>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeTab === tab ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Table Content */}
      {/* FIXED: Removed 'pb-20' and used 'pb-0' */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200 pb-0">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-gray-50 border-b z-10">
            {activeTab === 'interview' ? (
              // --- INTERVIEW HEADERS ---
              <tr className={`${interviewGrid} px-4 py-3 text-xs font-semibold text-gray-500`}>
                <th>Candidate</th>
                <th>Interviewer</th>
                <th>Meeting Link</th>
                <th>Time</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            ) : (
              // --- APPLICANT HEADERS ---
              <tr className={`${applicantGrid} px-4 py-3 text-xs font-semibold text-gray-500`}>
                <th className="text-center">Select</th>
                <th>Name</th>
                <th>Role</th>
                <th>Date</th>
                <th>Experience</th>
                <th>Resume</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            )}
          </thead>

          <tbody className="divide-y">
            {/* --- LOADING STATE --- */}
            {activeTab === 'interview' && isInterviewsLoading && (
               <tr><td colSpan={6} className="text-center py-8">Loading Interviews...</td></tr>
            )}

            {/* --- INTERVIEW ROWS --- */}
            {activeTab === 'interview' && !isInterviewsLoading && interviews.map((int) => (
              <tr key={int._id} className={`${interviewGrid} px-4 py-3 items-center hover:bg-gray-50 transition`}>
                <td>
                  <p className="font-semibold">{int.candidateName}</p>
                  <p className="text-xs text-gray-500">{int.candidateEmail}</p>
                </td>
                <td className="truncate" title={int.interviewer}>{int.interviewer}</td>
                <td>
                  <a href={int.meetingLink} target="_blank" className="text-blue-600 hover:underline truncate block w-32">
                    Join Meeting
                  </a>
                </td>
                <td>
                  {new Date(int.Timing).toLocaleString("en-US", { 
                    month: "short", day: "numeric", hour: "numeric", minute: "2-digit" 
                  })}
                </td>
                <td>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[int.status] || "bg-gray-100 text-gray-700"}`}>
                    {int.status}
                  </span>
                </td>
                <td className="text-center">
                  <button className="text-gray-400 hover:text-red-500 text-xs">Cancel</button>
                </td>
              </tr>
            ))}

            {/* --- APPLICANT ROWS --- */}
            {activeTab !== 'interview' && filteredApplicants.map((a) => (
              <tr key={a.id} className={`${applicantGrid} px-4 py-3 items-center hover:bg-gray-50 transition`}>
                <td className="flex justify-center">
                  <input
                    type="checkbox"
                    checked={selectedApplicants.includes(a.id)}
                    onChange={() => toggleSelect(a.id)}
                    className="h-4 w-4 accent-blue-600"
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td>
                  <p className="font-semibold">{a.name}</p>
                  <p className="text-xs text-gray-500">{a.email}</p>
                </td>
                <td>{a.role}</td>
                <td>{a.date}</td>
                <td>{a.experience}</td>
                <td>
                  <a href={a.resume} target="_blank" className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                    📄 Resume
                  </a>
                </td>
                <td>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[a.status]}`}>
                    {a.status}
                  </span>
                </td>
                <td className="relative flex justify-center">
                  {a.status === "shortlisted" && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveActionId(activeActionId === a.id ? null : a.id);
                        }}
                        className="p-1 rounded-full hover:bg-gray-200 transition"
                      >
                        <ThreeDotsIcon />
                      </button>
                      {activeActionId === a.id && (
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleScheduleInterview(a.candidateUserId);
                            }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition flex items-center gap-2"
                          >
                            Schedule Interview
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Empty States */}
        {activeTab === 'interview' && !isInterviewsLoading && interviews.length === 0 && (
           <div className="py-12 text-center text-sm text-gray-500">No interviews scheduled yet.</div>
        )}
        {activeTab !== 'interview' && filteredApplicants.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-500">No applicants found.</div>
        )}
      </div>
      
      <PopupForm 
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        candidateId={scheduleCandidateId} 
        jobId={jobId}
      />
    </div>
  );
}