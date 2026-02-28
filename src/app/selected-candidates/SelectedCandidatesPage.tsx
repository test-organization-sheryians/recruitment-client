"use client";

import { useShareCandidates } from "@/features/admin/users/hooks/useShareuser";
import { FileText, Home, Loader2, Mail, User, Linkedin, Github, Globe, Twitter, Phone, Download } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Experience } from "../../types/shareInterfaceCandidate";

/* ================= TYPES ================= */

interface BackendSkill {
  _id?: string;
  name?: string;
}

interface BackendCandidate {
  _id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  availability?: string;
  resumeFile?: string;
  skills?: BackendSkill[];
  experiences?: Experience[];
  createdAt?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
  };
  contactInfo?: {
    phone?: string;
  };
  user?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
  };
}

interface ShareCandidatesResponseShape {
  success?: boolean;
  message?: string;
  groupName?: string;
  count?: number;
  data?: {
    _id?: string;
    groupName?: string;
    selectedUsers?: BackendCandidate[];
    createdAt?: string;
    updatedAt?: string;
  };
}

interface UIShareCandidate {
  _id: string;
  userId: string;
  name: string;
  email: string;
  phoneNumber: string;
  availability: string;
  resumeFile?: string;
  skills: { _id: string; name: string }[];
  experiences: Experience[];
  createdAt?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    portfolio?: string;
    twitter?: string;
  };
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

  const uiCandidates: UIShareCandidate[] = useMemo(() => {
    let rawList: BackendCandidate[] = [];
    if (response?.data) {
      if (Array.isArray(response.data)) {
        rawList = response.data;
      } else if (response.data.selectedUsers && Array.isArray(response.data.selectedUsers)) {
        rawList = response.data.selectedUsers;
      }
    }

    return rawList.map((c: BackendCandidate): UIShareCandidate => {
      const firstName = c.user?.firstName || c.firstName || "";
      const lastName = c.user?.lastName || c.lastName || "";
      return {
        _id: c._id || Math.random().toString(),
        userId: (c as any).userId || c._id || "",
        name: `${firstName} ${lastName}`.trim() || "Candidate",
        email: c.user?.email || c.email || "N/A",
        availability: c.availability || "Immediate",
        resumeFile: c.resumeFile,
        skills: Array.isArray(c.skills) ? c.skills.map((s) => ({ _id: s._id || "", name: s.name || "" })) : [],
        experiences: Array.isArray(c.experiences) ? c.experiences : [],
        createdAt: c.createdAt,
        socialLinks: {
          linkedin: c.socialLinks?.linkedin || "",
          github: c.socialLinks?.github || "",
          portfolio: c.socialLinks?.portfolio || "",
          twitter: c.socialLinks?.twitter || "",
        },
        phoneNumber: c.contactInfo?.phone || c.user?.phoneNumber || "Not Provided",
      };
    });
  }, [response]);

  const groupName = response?.groupName || response?.data?.groupName || "Shared Group";

  useEffect(() => {
    if (uiCandidates.length > 0 && !activeId) {
      setActiveId(uiCandidates[0]._id);
    }
  }, [uiCandidates, activeId]);

  const activeCandidate = uiCandidates.find((c) => c._id === activeId) ?? null;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">{groupName}</h1>
            <p className="text-slate-700 text-sm mt-1">
              <span className="mr-1 text-sm font-normal text-slate-800">{uiCandidates.length}</span> Members
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 w-full sm:w-auto"
          >
            <Home className="h-4 w-4" /> Home
          </button>
        </div>

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
                    className={`w-full px-5 py-4 text-left transition ${activeId === c._id ? "bg-blue-50" : "hover:bg-slate-50"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-800 text-sm font-semibold text-white">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-800">{c.name}</p>
                        <p className="truncate text-xs text-slate-500">{c.email}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-10 text-center text-slate-400 text-sm">No members found.</div>
              )}
            </div>
          </aside>

          {/* RIGHT DETAILS */}
          <section className="lg:col-span-8 rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col">
            {activeCandidate ? (
              <div className="p-4 sm:p-8">
                {/* Profile Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 border-b pb-6">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl bg-slate-800 text-xl sm:text-2xl font-bold text-white shadow-md shrink-0">
                    {activeCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">{activeCandidate.name}</h2>
                    <p className="mt-1 sm:mt-2 text-sm text-slate-500">
                      Shared at: {activeCandidate.createdAt ? new Date(activeCandidate.createdAt).toLocaleString() : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Info Grid */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <InfoCard icon={<Mail className="h-5 w-5" />} label="Email" value={activeCandidate.email} />
                  <InfoCard icon={<Phone className="h-5 w-5" />} label="Phone" value={activeCandidate.phoneNumber} />
                  <InfoCard icon={<User className="h-5 w-5" />} label="Availability" value={activeCandidate.availability} />

                  {/* Skills */}
                  {activeCandidate.skills.length > 0 && (
                    <div className="col-span-1 sm:col-span-2">
                      <p className="mb-2 text-sm font-semibold text-slate-700">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {activeCandidate.skills.map((skill) => (
                          <span key={skill._id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border">
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Experience */}
                  {activeCandidate.experiences.length > 0 && (
                    <div className="col-span-1 sm:col-span-2">
                      <p className="mb-3 text-sm font-semibold text-slate-700">Experience</p>
                      <div className="space-y-3">
                        {activeCandidate.experiences.map((exp, index) => (
                          <div key={index} className="rounded-xl border p-4 hover:bg-slate-50 transition">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{exp.title || exp.role}</p>
                                <p className="text-sm text-slate-600">{exp.company}</p>
                              </div>
                              <span className="text-xs text-slate-500 whitespace-nowrap">
                                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {activeCandidate.socialLinks && (Object.values(activeCandidate.socialLinks).some(link => link !== "")) && (
                    <div className="col-span-1 sm:col-span-2 mt-2">
                      <p className="mb-2 text-sm font-semibold text-slate-700">Social Links</p>
                      <div className="flex flex-wrap gap-3">
                        {Object.entries(activeCandidate.socialLinks).map(([platform, url]) => {
                          if (!url) return null;
                          const colors: any = { linkedin: 'bg-[#0077b5]', github: 'bg-slate-900', portfolio: 'bg-emerald-600', twitter: 'bg-sky-500' };
                          const icons: any = { linkedin: <Linkedin className="h-3 w-3 text-white" />, github: <Github className="h-3 w-3 text-white" />, portfolio: <Globe className="h-3 w-3 text-white" />, twitter: <Twitter className="h-3 w-3 text-white" /> };
                          return (
                            <a key={platform} href={url.startsWith("http") ? url : `https://${url}`} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50 transition-all">
                              <div className={`p-1 rounded ${colors[platform] || 'bg-slate-500'}`}>{icons[platform] || <Globe className="h-3 w-3 text-white" />}</div>
                              <span className="capitalize">{platform}</span>
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* ULTIMATE FIXED RESUME SECTION */}
                  <div className="col-span-1 sm:col-span-2 mt-8">
                    <div className="flex items-center justify-between mb-4 px-1">
                      <p className="text-sm font-bold text-slate-800">Resume Document</p>
                      {activeCandidate.resumeFile && (
                        <a href={activeCandidate.resumeFile} download target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-md bg-blue-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-blue-700 shadow-sm active:scale-95">
                          <Download className="h-3.5 w-3.5" />
                          <span>Download PDF</span>
                        </a>
                      )}
                    </div>

                    {activeCandidate.resumeFile ? (
                      <div className="relative w-full rounded-xl border border-slate-200 bg-white overflow-hidden group shadow-md">
                        {/* Aspect ratio fix for all screens - standard A4 */}
                        <div className="w-full aspect-[1/1.41] md:aspect-[1/1.3] bg-white relative">
                          <iframe
                            src={`${activeCandidate.resumeFile}#view=FitH&navpanes=0&toolbar=0`}
                            className="absolute inset-0 w-full h-full border-none"
                            style={{ display: 'block', backgroundColor: '#ffffff' }}
                            title="Resume"
                          />
                        </div>
                        {/* Overlay to catch accidental touches on mobile */}
                        <div className="absolute inset-0 pointer-events-none border-2 border-transparent group-hover:border-blue-200 transition-colors rounded-xl" />
                      </div>
                    ) : (
                      <div className="p-10 text-center border-2 border-dashed rounded-xl text-slate-400 bg-slate-50">
                        <FileText className="h-10 w-10 mx-auto mb-2 opacity-20" />
                        <p className="text-sm font-medium">No resume available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex h-full min-h-[60vh] flex-col items-center justify-center text-slate-400">
                <User className="h-12 w-12 mb-2 opacity-10" />
                <p className="font-medium">Select a candidate to view details</p>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-xl border bg-slate-50/50 p-3 hover:bg-white transition shadow-sm border-slate-100">
      <div className="text-slate-400 shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight leading-none mb-1">{label}</p>
        <p className="text-sm font-semibold text-slate-700 truncate">{value}</p>
      </div>
    </div>
  );
}