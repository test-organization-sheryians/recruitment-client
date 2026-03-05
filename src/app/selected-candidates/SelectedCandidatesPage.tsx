"use client";

import { useShareCandidates } from "@/features/admin/users/hooks/useShareuser";
import { FileText, Home, Loader2, Mail, User, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Experience } from "../../types/shareInterfaceCandidate";

/* ================= TYPES ================= */

interface BackendUser {
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface BackendSkill {
  _id?: string;
  name?: string;
}

interface BackendCandidate {
  _id?: string;
  userId?: string;
  user?: BackendUser;
  firstName?: string;
  lastName?: string;
  email?: string;
  availability?: string;
  resumeFile?: string;
  skills?: BackendSkill[];
  experiences?: Experience[];
  createdAt?: string;
}

interface ShareCandidatesResponseShape {
  groupName?: string;
  selectedUsers?: BackendCandidate[];
  data?:
    | {
        groupName?: string;
        selectedUsers?: BackendCandidate[];
      }
    | BackendCandidate[]
    | null;
}

interface UIShareCandidate {
  _id: string;
  userId: string;
  name: string;
  email: string;
  availability: string;
  resumeFile?: string;
  skills: { _id: string; name: string }[];
  experiences: Experience[];
  createdAt?: string;
}

/* ================= HELPERS ================= */

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : "Present";
}

/* ================= COMPONENT ================= */

export default function SelectedCandidatesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const shareId = params.get("shareId") ?? "";

  const { data: response, isLoading } = useShareCandidates(shareId) as {
    data: ShareCandidatesResponseShape | undefined;
    isLoading: boolean;
  };

  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  /* ================= SAFE MAPPING ================= */

  const uiCandidates: UIShareCandidate[] = useMemo(() => {
    let rawList: BackendCandidate[] = [];

    if (Array.isArray(response?.data)) {
      // case: data is array
      rawList = response.data;
    } else if (response?.data?.selectedUsers) {
      // case: data object with selectedUsers
      rawList = response.data.selectedUsers;
    } else if (response?.selectedUsers) {
      // case: root selectedUsers
      rawList = response.selectedUsers;
    }

    return rawList.map((c) => ({
      _id: c?._id || Math.random().toString(),
      userId: c?.userId || "",
      name:
        `${c?.user?.firstName || c?.firstName || ""} ${
          c?.user?.lastName || c?.lastName || ""
        }`.trim() || "Candidate",
      email: c?.user?.email || c?.email || "N/A",
      availability: c?.availability || "N/A",
      resumeFile: c?.resumeFile,
      skills: (c?.skills ?? []).map((skill) => ({
        _id: skill?._id ?? "",
        name: skill?.name ?? "",
      })),
      experiences: c?.experiences ?? [],
      createdAt: c?.createdAt,
    }));
  }, [response]);

  /* ================= GROUP NAME ================= */

  const groupName =
    response?.groupName ||
    (typeof response?.data === "object" && !Array.isArray(response?.data)
      ? response?.data?.groupName
      : undefined) ||
    "Shared Group";

  /* ================= ACTIVE CANDIDATE ================= */

  useEffect(() => {
    if (uiCandidates.length > 0 && !activeId) {
      setActiveId(uiCandidates[0]._id);
    }
  }, [uiCandidates, activeId]);

  const activeCandidate = uiCandidates.find((c) => c._id === activeId) ?? null;

  /* ================= LOADING ================= */

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header - Responsive Flex: Column on mobile, Row on desktop */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              {groupName}
            </h1>

            <p className="text-slate-700 text-sm mt-1">
              <span className="mr-1 text-sm font-normal text-slate-800">
                {uiCandidates.length}
              </span>
              Members
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 w-full sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Home
          </button>
        </div>

        {/* Main Grid - Responsive: Stacked (1 col) on mobile, Split (12 cols) on desktop */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          
          {/* LEFT LIST */}
          <aside className="lg:col-span-4 overflow-hidden rounded-xl border bg-white shadow-sm flex flex-col h-auto lg:max-h-[70vh]">
            <div className="border-b px-5 py-4 text-sm font-semibold text-slate-700 bg-slate-50/50 shrink-0">
              Candidates
            </div>

            <div className="divide-y overflow-y-auto flex-1 min-h-0">
              {uiCandidates.length > 0 ? (
                uiCandidates.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => setActiveId(c._id)}
                    className={`w-full px-5 py-4 text-left transition ${
                      activeId === c._id
                        ? "bg-blue-50 border-r-4 border-slate-800"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-800 text-sm font-semibold text-white">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">
                          {c.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {c.email}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 text-sm">
                  No members found.
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT DETAILS */}
          <section className="lg:col-span-8 max-h-none lg:max-h-[80vh] overflow-y-auto rounded-xl border bg-white shadow-sm">
            {activeCandidate ? (
              <div className="p-6 sm:p-8">
                {/* Profile Header - Stack on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-b pb-6">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl bg-slate-800 text-xl sm:text-2xl font-bold text-white shadow-md shrink-0">
                    {activeCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">
                      {activeCandidate.name}
                    </h2>
                    <p className="mt-1 sm:mt-2 text-sm text-slate-500">
                      Shared at:{" "}
                      {activeCandidate.createdAt
                        ? new Date(activeCandidate.createdAt).toLocaleString()
                        : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Info Grid - Single column mobile, Double column desktop */}
                <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <InfoCard
                    icon={<Mail className="h-5 w-5" />}
                    label="Email"
                    value={activeCandidate.email}
                  />

                  <InfoCard
                    icon={<User className="h-5 w-5" />}
                    label="Availability"
                    value={activeCandidate.availability}
                  />

                  {activeCandidate.skills.length > 0 && (
                    <div className="col-span-1 sm:col-span-2">
                      <p className="mb-2 text-sm font-semibold text-slate-700">
                        Skills
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {activeCandidate.skills.map((skill) => (
                          <span
                            key={skill._id}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCandidate.experiences.length > 0 && (
                    <div className="col-span-1 sm:col-span-2">
                      <p className="mb-3 text-sm font-semibold text-slate-700">
                        Experience
                      </p>
                      <div className="space-y-3">
                        {activeCandidate.experiences.map((exp, index) => (
                          <div
                            key={index}
                            className="rounded-xl border p-4 hover:bg-slate-50 transition"
                          >
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">
                                  {exp.title || exp.role}
                                </p>
                                <p className="text-sm text-slate-600">
                                  {exp.company}
                                </p>
                              </div>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {formatDate(exp.startDate)} –{" "}
                                {formatDate(exp.endDate)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCandidate.resumeFile && (
                    <div className="col-span-1 sm:col-span-2">
                      <a
                        href={activeCandidate.resumeFile}
                        target="_blank"
                        className="flex items-center justify-center gap-2 rounded-lg border bg-blue-50 p-4 text-blue-600 font-semibold hover:underline"
                      >
                        <FileText className="h-5 w-5" />
                        Download Resume
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[300px] items-center justify-center p-12 text-slate-400">
                <p>Select a candidate to view details</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="font-bold text-slate-800">Group Members</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-full p-1 hover:bg-slate-100"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-4 space-y-3">
              {uiCandidates.map((m) => (
                <div
                  key={m._id}
                  className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg"
                >
                  <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold">
                    {m.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {m.email}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= INFO CARD ================= */

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-4 rounded-lg border bg-slate-50/50 p-4 hover:bg-white transition shadow-sm">
      <div className="text-slate-500">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-slate-800 break-all">{value}</p>
      </div>
    </div>
  );
}