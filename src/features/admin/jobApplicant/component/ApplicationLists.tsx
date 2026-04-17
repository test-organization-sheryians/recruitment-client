"use client";

import { useState, useEffect } from "react";
import {
  useBulkUpdateApplicants,
  useJobApplicant,
  useInterviewsByJob,
} from "../hooks/useJobApplicant";
import { useParams, useRouter, usePathname, useSearchParams } from "next/navigation";
import { useToast } from "@/components/ui/Toast";
import PopupForm from "./PopupForm";
import {
  ApplicantStatus,
  ApplicantRow,
  ApplicantsApiResponse,
} from "@/types/applicant";
import { updateInterviewStatus } from "@/api/jobApplication/scheduleInterview";
import AnswerPopup, { QuestionAnswer } from "./AnswerPopup";
import { Eye, Calendar, RefreshCw } from "lucide-react";

/* ================= TYPES ================= */
type Size = number | string;
type ApplicantsListProps = {
  height?: Size;
  width?: Size;
  className?: string;
};

interface ExtendedApplicantRow extends Omit<ApplicantRow, "id"> {
  id: string;
  candidateUserId: string;
  name: string;
  email: string;
  role: string;
  date: string;
  experience: string;
  status: ApplicantStatus;
  resume: string;
  answers: QuestionAnswer[];
  interviewCompleted?: boolean;
}

interface InterviewRow {
  _id: string;
  candidateName: string;
  candidateEmail: string;
  interviewer: string;
  jobTitle: string;
  meetingLink: string;
  Timing: string;
  status: string;
  applicationId?: string;
}

/* ================= CONSTANTS ================= */
const statusColors: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  shortlisted: "bg-yellow-100 text-yellow-700",
  rejected: "bg-red-100 text-red-700",
  forwarded: "bg-purple-100 text-purple-700",
  interview: "bg-orange-100 text-orange-700",
  hired: "bg-green-100 text-green-700",
  scheduled: "bg-indigo-100 text-indigo-700",
  rescheduled: "bg-orange-100 text-orange-700",
  cancelled: "bg-red-100 text-red-700",
};

const tabs: Array<"all" | ApplicantStatus | "scheduled"> = [
  "all",
  "applied",
  "shortlisted",
  "forwarded",
  "interview",
  "scheduled",
  "hired",
  "rejected",
];

function buildDestForStatus(
  status: string,
  pathname: string,
  searchParams: URLSearchParams | null
) {
  try {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("tab", status);
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  } catch (e) {
    return `${pathname}?tab=${status}`;
  }
}

export default function ApplicantsList({
  height = "100%",
  width = "100%",
  className = "",
}: ApplicantsListProps) {
  const style = {
    height: typeof height === "number" ? `${height}px` : height,
    width: typeof width === "number" ? `${width}px` : width,
  };

  const { id } = useParams();
  const jobId = id as string;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const currentTab = searchParams?.get("tab");
      if (!currentTab) {
        const dest = buildDestForStatus(
          "applied",
          pathname || "",
          (searchParams as any) ?? null
        );
        router.replace(dest);
      }
    } catch (e) {
      console.error("Failed to set default tab", e);
    }
  }, [searchParams, pathname, router]);

  const handlePopupSuccess = async () => {
    try {
      setIsPopupOpen(false);
      setSelectedApplicants([]);
      refetchApplicants();
      setTimeout(() => refetchInterviews(), 500);
      await new Promise((resolve) => setTimeout(resolve, 0));
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("tab", "scheduled");
      const qs = params.toString();
      const dest = qs ? `${pathname}?${qs}` : pathname || "/";
      await router.replace(dest);
    } catch (e) {
      console.error("Failed to navigate to scheduled tab", e);
    }
  };

  const { data, refetch: refetchApplicants } = useJobApplicant(jobId) as {
    data?: ApplicantsApiResponse;
    refetch: () => void;
  };

  const activeTab = (
    (searchParams?.get("tab") as "all" | ApplicantStatus | "scheduled") ||
    "applied"
  );

  const {
    data: interviewResponse,
    isLoading: isInterviewsLoading,
    refetch: refetchInterviews,
  } = useInterviewsByJob(jobId);

  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<ApplicantStatus>("applied");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [scheduleCandidateId, setScheduleCandidateId] = useState<string | null>(null);
  const [interviewMode, setInterviewMode] = useState<"schedule" | "reschedule">("schedule");
  const [selectedInterviewId, setSelectedInterviewId] = useState<string | null>(null);
  const [isAnswerPopupOpen, setIsAnswerPopupOpen] = useState(false);
  const [selectedApplicantData, setSelectedApplicantData] = useState<{
    name: string;
    answers: QuestionAnswer[];
  }>({ name: "", answers: [] });

  const { mutate, isPending } = useBulkUpdateApplicants();
  const { success, error } = useToast();

  /* ================= HANDLERS ================= */
  const toggleSelect = (appId: string) => {
    setSelectedApplicants((prev) =>
      prev.includes(appId) ? prev.filter((x) => x !== appId) : [...prev, appId]
    );
  };

  const toggleSelectAll = (visibleAppIds: string[]) => {
    const ids = visibleAppIds.filter(Boolean) as string[];
    if (ids.length === 0) return;
    const allSelected = ids.every((id) => selectedApplicants.includes(id));
    if (allSelected) {
      setSelectedApplicants((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedApplicants((prev) => Array.from(new Set([...prev, ...ids])));
    }
  };

  const handleScheduleInterview = (
    candidateUserId: string,
    applicationId: string,
    mode: "schedule" | "reschedule",
    interviewId?: string
  ) => {
    setScheduleCandidateId(candidateUserId);
    setSelectedApplicants([applicationId]);
    setInterviewMode(mode);
    setSelectedInterviewId(interviewId || null);
    setIsPopupOpen(true);
  };

  const handleSubmit = () => {
    if (selectedApplicants.length === 0) {
      error("Please select at least one applicant");
      return;
    }
    mutate(
      { applicationIds: selectedApplicants, status: bulkStatus },
      {
        onSuccess: () => {
          success("Applicants status updated successfully");
          setSelectedApplicants([]);
          refetchApplicants();
          setTimeout(() => refetchInterviews(), 500);
          try {
            const dest = buildDestForStatus(
              bulkStatus,
              pathname || "",
              (searchParams as any) ?? null
            );
            setTimeout(() => router.push(dest), 600);
          } catch (e) {
            console.error("Navigation after status update failed", e);
          }
        },
        onError: () => error("Failed to update applicant status"),
      }
    );
  };

  const handleCancelInterview = async (interviewId: string) => {
    try {
      await updateInterviewStatus(interviewId, "Cancelled");
      success("Interview cancelled successfully");
      refetchInterviews();
    } catch (err) {
      error(err instanceof Error ? err.message : "Failed to cancel interview");
    }
  };

  const handleApplicantStatusUpdate = (applicationId: string | undefined, newStatus: "hired" | "rejected") => {
    if (!applicationId) {
      error("Missing application id");
      return;
    }

    mutate(
      { applicationIds: [applicationId], status: newStatus },
      {
        onSuccess: () => {
          success(`Applicant marked as ${newStatus}`);
          setSelectedApplicants((prev) => prev.filter((id) => id !== applicationId));
          refetchApplicants();
          setTimeout(() => refetchInterviews(), 500);
          try {
            const dest = buildDestForStatus(
              newStatus,
              pathname || "",
              (searchParams as any) ?? null
            );
            setTimeout(() => router.replace(dest), 600);
          } catch (e) {
            console.error("Navigation after status update failed", e);
          }
        },
        onError: () => error("Failed to update applicant status"),
      }
    );
  };

  /* ================= DATA MAPPING ================= */
  const applicants: ExtendedApplicantRow[] =
    data?.applicants?.map((a) => ({
      id: a._id ?? a.candidateId,
      candidateUserId: a.candidateDetails?._id || a.candidateId || "",
      name: a.candidateDetails
        ? `${a.candidateDetails.firstName} ${a.candidateDetails.lastName}`
        : "Unknown",
      email: a.candidateDetails?.email || "No Email",
      role: a.jobDetails?.title || "Unknown",
      date: new Date(a.appliedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      experience: a.jobDetails
        ? `${a.totalExperienceYears}-${a.jobDetails.requiredExperience} yrs`
        : `${a.totalExperienceYears} yrs`,
      status: (a.status || "").toString().toLowerCase(),
      interviewCompleted: Boolean(a.interviewCompleted),
      resume: a.resumeUrl,
      answers: a.answers || [],
    })) ?? [];

  const filteredApplicants =
    activeTab === "all"
      ? applicants
      : applicants.filter((a) => a.status === activeTab);

  const rawInterviews = Array.isArray(interviewResponse)
    ? interviewResponse
    : Array.isArray(interviewResponse?.data)
    ? interviewResponse.data
    : Array.isArray(interviewResponse?.interviews)
    ? interviewResponse.interviews
    : [];

  const interviews: InterviewRow[] = rawInterviews.map((int: any) => {
    const candidateName = int.candidateId
      ? `${int.candidateId.firstName || ""} ${int.candidateId.lastName || ""}`.trim() || "Unknown"
      : (int as any).candidateName || "Unknown";

    const candidateEmail =
      int.candidateId?.email || (int as any).candidateEmail || "Unknown";

    const interviewer =
      int.interviewerEmail ||
      (int as any).interviewer ||
      (int as any).recruiterEmail ||
      "Unknown";

    const meetingLink =
      int.meetingLink || (int as any).meetingUrl || (int as any).meeting || "";

    const timing =
      int.timing || (int as any).Timing || (int as any).createdAt || "";

    return {
      _id: int._id,
      candidateName,
      candidateEmail,
      interviewer,
      jobTitle: (int as any).jobTitle || "Job Role",
      meetingLink,
      Timing: timing,
      status: ((): string => {
        const raw = (int.status || "").toString();
        if (!raw) return "scheduled";
        if (raw.toLowerCase() === "rescheduled") return "scheduled";
        return raw.toLowerCase();
      })(),
      applicationId:
        int.applicationId && typeof int.applicationId === "string"
          ? int.applicationId
          : int.applicationId && int.applicationId._id
          ? int.applicationId._id
          : int.applicationIdString ||
            int.application ||
            int.application_id ||
            undefined,
    } as InterviewRow;
  });

  const scheduledInterviews = interviews.filter(
    (i) => i.status === "scheduled"
  );

  const getInterviewForApplicant = (email: string) =>
    interviews.find(
      (i) =>
        (i.candidateEmail || "").toLowerCase() === (email || "").toLowerCase()
    );

  /* ================= RENDER ================= */
  return (
    <div
      className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-5 flex flex-col overflow-hidden ${className}`}
      style={style}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="text-lg font-semibold text-gray-900">
          {activeTab === "scheduled" ? "Scheduled Interviews" : "Applicants Lists"}
        </span>

        {selectedApplicants.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={bulkStatus}
              onChange={(e) => setBulkStatus(e.target.value as ApplicantStatus)}
              className="border rounded-xl px-2 py-1"
            >
              {tabs
                .filter((t) => t !== "all")
                .map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
            </select>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className={`rounded-xl px-3 py-2 text-sm font-semibold text-white ${
                isPending ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              }`}
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
            onClick={() => {
              try {
                const dest = buildDestForStatus(
                  String(tab),
                  pathname || "",
                  (searchParams as any) ?? null
                );
                router.push(dest);
              } catch (e) {
                console.error("Failed to change tab", e);
              }
            }}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
              activeTab === tab
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {String(tab).charAt(0).toUpperCase() + String(tab).slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto rounded-xl border border-gray-200">

        {/* ===================== SCHEDULED TAB ===================== */}
        {activeTab === "scheduled" && (
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-gray-50 border-b z-10">
              <tr>
                {/* FIX: Checkbox header column added to match data rows */}
                <th className="w-10 px-3 py-3 text-center text-xs font-semibold text-gray-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    onChange={() => {
                      const ids = scheduledInterviews
                        .map((i) => i.applicationId)
                        .filter(Boolean) as string[];
                      toggleSelectAll(ids);
                    }}
                    checked={
                      scheduledInterviews.length > 0 &&
                      scheduledInterviews
                        .map((i) => i.applicationId)
                        .filter(Boolean)
                        .every((id) => selectedApplicants.includes(id as string))
                    }
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[160px]">
                  Candidate
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[160px]">
                  Interviewer
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[120px]">
                  Meeting Link
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[150px]">
                  Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[120px]">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 min-w-[80px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isInterviewsLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-gray-500">
                    Loading Interviews...
                  </td>
                </tr>
              ) : scheduledInterviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-sm text-gray-500">
                    No scheduled interviews found.
                  </td>
                </tr>
              ) : (
                scheduledInterviews.map((int) => {
                  const mappedAppId =
                    int.applicationId ||
                    applicants.find(
                      (a) =>
                        (a.email || "").toLowerCase() ===
                        (int.candidateEmail || "").toLowerCase()
                    )?.id;

                  const isChecked = mappedAppId
                    ? selectedApplicants.includes(mappedAppId)
                    : false;

                  const isRescheduled = (
                    rawInterviews.find((r: any) => r._id === int._id) as any
                  )?.isRescheduled;

                  return (
                    <tr
                      key={int._id}
                      className="hover:bg-gray-50 transition"
                    >
                      {/* Checkbox */}
                      <td className="w-10 px-3 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() =>
                            mappedAppId && toggleSelect(mappedAppId)
                          }
                          disabled={!mappedAppId}
                          className="h-4 w-4 accent-blue-600"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>

                      {/* Candidate */}
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800 whitespace-nowrap">
                          {int.candidateName}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">
                          {int.candidateEmail}
                        </p>
                      </td>

                      {/* Interviewer */}
                      <td className="px-4 py-3">
                        <p
                          className="text-gray-700 truncate max-w-[180px]"
                          title={int.interviewer}
                        >
                          {int.interviewer}
                        </p>
                      </td>

                      {/* Meeting Link */}
                      <td className="px-4 py-3">
                        {int.status?.toLowerCase() !== "cancelled" &&
                        int.meetingLink ? (
                          <a
                            href={int.meetingLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline font-medium text-sm"
                          >
                            Join Meeting
                          </a>
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>

                      {/* Time */}
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                        {int.Timing
                          ? new Date(int.Timing).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize whitespace-nowrap ${
                              statusColors[int.status?.toLowerCase()] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {int.status}
                          </span>
                          {isRescheduled && (
                            <span className="rounded-full px-2 py-0.5 text-[10px] font-semibold bg-yellow-100 text-yellow-700 whitespace-nowrap">
                              Rescheduled
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-center">
                        {int.status?.toLowerCase() !== "cancelled" && (
                          <button
                            onClick={() => handleCancelInterview(int._id)}
                            className="text-white px-4 py-1 rounded  hover:cursor-pointer hover:bg-red-600 text-xs bg-red-500 font-medium whitespace-nowrap"
                          >
                            Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {/* ===================== APPLICANTS TABS ===================== */}
        {activeTab !== "scheduled" && (
          <table className="w-full text-sm border-collapse">
            <thead className="sticky top-0 bg-gray-50 border-b z-10">
              <tr>
                <th className="w-10 px-3 py-3 text-center text-xs font-semibold text-gray-500">
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-blue-600"
                    checked={
                      filteredApplicants.length > 0 &&
                      filteredApplicants.every((a) =>
                        selectedApplicants.includes(a.id)
                      )
                    }
                    onChange={() =>
                      toggleSelectAll(filteredApplicants.map((a) => a.id))
                    }
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[160px]">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[120px]">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[110px]">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[110px]">
                  Experience
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[90px]">
                  Resume
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[110px]">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 min-w-[130px]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="text-center py-12 text-sm text-gray-500"
                  >
                    No applicants found.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition">
                    {/* Checkbox */}
                    <td className="w-10 px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={selectedApplicants.includes(a.id)}
                        onChange={() => toggleSelect(a.id)}
                        className="h-4 w-4 accent-blue-600"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </td>

                    {/* Name */}
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-800 whitespace-nowrap">
                        {a.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate max-w-[180px]">
                        {a.email}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="px-4 py-3 text-gray-700">{a.role}</td>

                    {/* Date */}
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {a.date}
                    </td>

                    {/* Experience */}
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {a.experience}
                    </td>

                    {/* Resume */}
                    <td className="px-4 py-3">
                      <a
                        href={a.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        📄 Resume
                      </a>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize whitespace-nowrap ${
                          statusColors[a.status] || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {a.status}
                      </span>
                      {(a.status === "hired" || a.status === "rejected") &&
                        a.interviewCompleted && (
                          <div className="text-xs text-green-600 font-medium mt-1">
                            Interview Completed
                          </div>
                        )}
                    </td>

                    {/* Action */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1.5">
                        {/* Answers button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedApplicantData({
                              name: a.name,
                              answers: a.answers || [],
                            });
                            setIsAnswerPopupOpen(true);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors whitespace-nowrap"
                        >
                          <Eye size={13} />
                          Answers
                        </button>

                        {/* Schedule / Reschedule button */}
                        {a.status === "interview" &&
                          (() => {
                            const interview = getInterviewForApplicant(a.email);
                            return interview ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleScheduleInterview(
                                    a.candidateUserId,
                                    a.id,
                                    "reschedule",
                                    interview._id
                                  );
                                }}
                                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors whitespace-nowrap"
                              >
                                <RefreshCw size={13} />
                                Reschedule
                              </button>
                            ) : (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleScheduleInterview(
                                    a.candidateUserId,
                                    a.id,
                                    "schedule"
                                  );
                                }}
                                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-green-600 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors whitespace-nowrap"
                              >
                                <Calendar size={13} />
                                Schedule
                              </button>
                            );
                          })()}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <PopupForm
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          setSelectedApplicants([]);
          refetchApplicants();
          setTimeout(() => refetchInterviews(), 500);
        }}
        onSuccess={handlePopupSuccess}
        candidateId={scheduleCandidateId}
        jobId={jobId}
        applicationId={selectedApplicants[0] || ""}
        mode={interviewMode}
        interviewId={selectedInterviewId}
      />

      <AnswerPopup
        isOpen={isAnswerPopupOpen}
        onClose={() => setIsAnswerPopupOpen(false)}
        applicantName={selectedApplicantData.name}
        answers={selectedApplicantData.answers}
      />
    </div>
  );
}