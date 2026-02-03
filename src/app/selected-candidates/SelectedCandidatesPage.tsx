'use client';

import { useShareCandidates } from '@/features/admin/users/hooks/useShareuser';
import { FileText, Loader2, Mail, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Experience, ShareCandidate } from '../../types/shareInterfaceCandidate';

interface UIShareCandidate {
  _id: string;
  userId: string;
  name: string;
  email: string;
  availability: string | { min?: number; max?: number; currency?: string };
  resumeFile?: string;
  skills: { _id: string; name: string }[];
  experiences: Experience[];
  createdAt?: string;
}

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : 'Present';
}

function formatAvailability(availability: string | { min?: number; max?: number; currency?: string } | undefined | null): string {
  if (!availability) {
    return 'N/A';
  }
  if (typeof availability === 'string') {
    return availability === 'looking' ? 'Actively Looking' : 'Not Looking';
  }
  if (typeof availability === 'object') {
    const { min, max, currency } = availability;
    if (min !== undefined && min !== null && max !== undefined && max !== null && currency) {
      return `${currency} ${min}k - ${max}k`;
    }
  }
  return 'N/A';
}

export default function SelectedCandidatesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const shareId = params.get('shareId') ?? '';

  const { data: backendCandidates = [], isLoading } = useShareCandidates(shareId);

  const uiCandidates: UIShareCandidate[] = backendCandidates.map((c: ShareCandidate) => ({
    _id: c._id,
    userId: c.userId,
    name: `${c.user.firstName} ${c.user.lastName}`,
    email: c.user.email,
    availability: c.availability,
    resumeFile: c.resumeFile,
    skills: (c.skills ?? []).map(skill => ({
      _id: skill._id ?? '',
      name: skill.name ?? '',
    })),
    experiences: c.experiences ?? [],
    createdAt: c.createdAt,
  }));

  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (uiCandidates.length > 0 && !activeId) {
      setActiveId(uiCandidates[0]._id);
    }
  }, [uiCandidates, activeId]);

  const activeCandidate = uiCandidates.find(c => c._id === activeId) ?? null;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!isLoading && uiCandidates.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-800">
            No shared candidates found
          </h1>
          <button
            onClick={() => router.push('/')}
            className="mt-4 rounded-lg border bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <div className="border-b bg-white px-4 sm:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Shared Candidates <span className="text-slate-400">({uiCandidates.length})</span>
          </h1>
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-4 sm:p-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* MOBILE DROPDOWN */}
          <div className="lg:hidden">
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full flex items-center justify-between gap-2 rounded-lg bg-white border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-800 hover:bg-slate-50"
              >
                <span className="truncate">
                  {activeCandidate ? activeCandidate.name : 'Select a candidate'}
                </span>
                <svg
                  className={`h-5 w-5 flex-shrink-0 transition-transform text-slate-500 ${dropdownOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute top-full mt-2 w-full z-10 rounded-lg bg-white border border-slate-200 shadow-lg">
                  <div className="max-h-60 overflow-y-auto">
                    {uiCandidates.map(c => (
                      <button
                        key={c._id}
                        onClick={() => {
                          setActiveId(c._id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                          activeId === c._id
                            ? 'bg-slate-100'
                            : 'hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-sm font-semibold text-white flex-shrink-0">
                          {c.name.charAt(0).toLowerCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-slate-900 truncate text-sm">{c.name}</p>
                          <p className="text-xs text-slate-500 truncate">{c.email}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* DESKTOP LIST */}
          <div className="hidden lg:block lg:w-96 lg:flex-shrink-0">
            <div className="rounded-lg bg-white shadow-sm border border-slate-200">
              <div className="border-b bg-slate-50 px-5 py-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Candidates
                </h2>
              </div>
              <div className="max-h-[calc(100vh-220px)] overflow-y-auto">
                {uiCandidates.map(c => (
                  <button
                    key={c._id}
                    onClick={() => setActiveId(c._id)}
                    className={`w-full px-5 py-4 text-left transition border-b border-slate-100 last:border-b-0 ${
                      activeId === c._id
                        ? 'bg-slate-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-700 text-base font-semibold text-white flex-shrink-0">
                        {c.name.charAt(0).toLowerCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-slate-900 truncate">{c.name}</p>
                        <p className="text-sm text-slate-500 truncate">{c.email}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT DETAILS */}
          <div className="flex-1 min-w-0">
            {activeCandidate ? (
              <div className="rounded-lg bg-white shadow-sm border border-slate-200 p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start gap-6 border-b pb-6">
                  <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-xl bg-slate-700 text-2xl sm:text-3xl font-bold text-white flex-shrink-0">
                    {activeCandidate.name.charAt(0).toLowerCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">
                      {activeCandidate.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-500 break-words">
                      Shared at:{' '}
                      {activeCandidate.createdAt
                        ? new Date(activeCandidate.createdAt).toLocaleString()
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InfoCard icon={<Mail className="h-5 w-5" />} label="Email" value={activeCandidate.email} />
                  <InfoCard 
                    icon={<User className="h-5 w-5" />} 
                    label="Availability" 
                    value={formatAvailability(activeCandidate.availability) || 'N/A'} 
                  />
                </div>

                {activeCandidate.skills.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {activeCandidate.skills.map(skill => (
                        <span
                          key={skill._id}
                          className="rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-900"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeCandidate.experiences.length > 0 && (
                  <div className="mt-8">
                    <h3 className="mb-4 text-lg font-semibold text-slate-900">
                      Experience
                    </h3>
                    <div className="space-y-6">
                      {activeCandidate.experiences.map((exp: Experience, index: number) => (
                        <div key={index} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <h4 className="font-semibold text-slate-900 break-words">
                            {exp.title}
                          </h4>
                          <p className="mt-1 text-sm text-slate-600 break-words">
                            {exp.company} • {exp.location}
                          </p>
                          <p className="mt-2 text-sm text-slate-500">
                            {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeCandidate.resumeFile && (
                  <div className="mt-8">
                    <a
                      href={activeCandidate.resumeFile}
                      download
                      className="inline-flex items-center gap-2 rounded-lg bg-white border-2 border-blue-700 px-4 py-2.5 text-sm font-medium text-blue-700 hover:bg-blue-50"
                    >
                      <FileText className="h-5 w-5" />
                      Download Resume
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex h-96 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-200">
                <p className="text-slate-500 px-4 text-center">
                  Select a candidate to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-center gap-3 mb-2">
        <div className="text-slate-600">{icon}</div>
        <p className="text-sm font-medium text-slate-600">{label}</p>
      </div>
      <p className="text-base text-slate-900 break-words font-medium">{String(value)}</p>
    </div>
  );
}