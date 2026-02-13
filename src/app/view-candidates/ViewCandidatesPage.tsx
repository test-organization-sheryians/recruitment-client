'use client';

import { useViewCandidates } from '@/features/admin/users/hooks/useShareuser';
import { FileText, Home, Loader2, Mail, User, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Experience, ShareCandidate } from '../../types/shareInterfaceCandidate';

interface UICandidate {
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

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : 'Present';
}

export default function ViewCandidatesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const candidateIdsParam = params.get('ids') ?? '';
  const [candidateIds, setCandidateIds] = useState<string[]>([]);

  // Parse candidate IDs from URL parameter
  useEffect(() => {
    if (candidateIdsParam) {
      const ids = candidateIdsParam.split(',').filter(id => id.trim());
      console.log('Parsed candidate IDs from URL:', ids);
      setCandidateIds(ids);
    }
  }, [candidateIdsParam]);

  const { data: backendCandidates = [], isLoading, isError, error } = useViewCandidates(candidateIds);

  useEffect(() => {
    console.log('ViewCandidatesPage - Search params:', {
      rawParam: candidateIdsParam,
      parsedIds: candidateIds,
    });
  }, [candidateIdsParam, candidateIds]);

  useEffect(() => {
    console.log('ViewCandidatesPage - Query state:', {
      isLoading,
      isError,
      error: error?.message || String(error),
      dataLength: backendCandidates?.length,
      data: backendCandidates,
    });
  }, [isLoading, isError, error, backendCandidates]);

  const uiCandidates: UICandidate[] = backendCandidates.map((c: ShareCandidate) => ({
    _id: c._id,
    userId: c.userId,
    name: `${c.user.firstName} ${c.user.lastName}`,
    email: c.user.email,
    availability: c.availability,
    resumeFile: c.resumeFile,

    //  normalize optional → required
    skills: (c.skills ?? []).map(skill => ({
      _id: skill._id ?? '',
      name: skill.name ?? '',
    })),

    experiences: c.experiences ?? [],
    createdAt: c.createdAt,
  }));

  const [activeId, setActiveId] = useState<string | null>(null);
  const [resumeToView, setResumeToView] = useState<string | null>(null);

  useEffect(() => {
    if (uiCandidates.length > 0 && !activeId) {
      setActiveId(uiCandidates[0]._id);
    }
  }, [uiCandidates, activeId]);

  const activeCandidate = uiCandidates.find(c => c._id === activeId) ?? null;

  // If no candidate IDs provided in URL
  if (candidateIds.length === 0 && !isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-100">
        <User className="mb-4 h-12 w-12 text-slate-400" />
        <p className="text-sm text-slate-500 mb-2">No candidates to view</p>
        <p className="text-xs text-slate-400 mb-4">Please select candidates from the users table</p>
        <button
          onClick={() => router.push('/admin/users')}
          className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50"
        >
          Go Back to Users
        </button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-600 mx-auto mb-2" />
          <p className="text-slate-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  if (isError || error) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-100">
        <p className="text-sm text-red-500 mb-4">Error loading candidates: {String(error)}</p>
        <button
          onClick={() => router.push('/admin/users')}
          className="rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (!isLoading && uiCandidates.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-100">
        <User className="mb-4 h-12 w-12 text-slate-400" />
        <p className="text-sm text-slate-500">No candidates found</p>
        <button
          onClick={() => router.push('/admin/users')}
          className="mt-4 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-slate-50"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-800">
            View Candidates
            <span className="ml-2 text-sm font-normal text-slate-500">({uiCandidates.length})</span>
          </h1>

          <button
            onClick={() => router.push('/admin/users')}
            className="flex items-center gap-2 rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
          >
            <Home className="h-4 w-4" />
            Back to Users
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT LIST */}
          <aside className="col-span-4 overflow-hidden rounded-xl border bg-white">
            <div className="border-b px-5 py-4 text-sm font-semibold text-slate-700">
              Candidates
            </div>

            <div className="divide-y">
              {uiCandidates.map(c => (
                <button
                  key={c._id}
                  onClick={() => setActiveId(c._id)}
                  className={`w-full px-5 py-4 text-left transition ${
                    activeId === c._id
                      ? 'bg-slate-100 shadow-inner'
                      : 'hover:bg-slate-50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-800 text-sm font-semibold text-white">
                      {c.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">{c.name}</p>
                      <p className="truncate text-xs text-slate-500">{c.email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* RIGHT DETAILS */}
          <section className="col-span-8 max-h-[80vh] overflow-y-auto rounded-xl border bg-white">
            {activeCandidate ? (
              <div className="p-8">
                <div className="flex items-center gap-6 border-b pb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-800 text-2xl font-bold text-white">
                    {activeCandidate.name.charAt(0)}
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800">
                      {activeCandidate.name}
                    </h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Viewed at:{' '}
                      {new Date().toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
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
                    <div className="col-span-2">
                      <p className="mb-2 text-sm font-semibold text-slate-700">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {activeCandidate.skills.map(skill => (
                          <span
                            key={skill._id}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCandidate.experiences.length > 0 && (
                    <div className="col-span-2">
                      <p className="mb-3 text-sm font-semibold text-slate-700">Experience</p>

                      <div className="space-y-3">
                        {activeCandidate.experiences.map((exp: Experience, index: number) => (
                          <div
                            key={exp._id || index}
                            className="group rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{exp.title}</p>
                                <p className="text-sm text-slate-600">
                                  {exp.company} • {exp.location}
                                </p>
                              </div>
                              <span className="text-xs text-slate-500">
                                {formatDate(exp.startDate)} – {formatDate(exp.endDate)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeCandidate.resumeFile && (
                    <div className="col-span-2">
                      <button
                        onClick={() => setResumeToView(activeCandidate.resumeFile)}
                        className="w-full flex items-center gap-2 rounded-lg border bg-slate-50 p-4 text-blue-600 hover:bg-slate-100 transition"
                      >
                        <FileText className="h-5 w-5" />
                        View Resume
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center p-12 text-slate-400">
                <p>Select a candidate to view details</p>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* RESUME VIEWER MODAL */}
      {resumeToView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative h-[90vh] w-[90vw] max-w-5xl rounded-xl bg-white shadow-2xl flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <h3 className="text-lg font-semibold text-slate-800">Resume</h3>
              <button
                onClick={() => setResumeToView(null)}
                className="rounded-full p-2 hover:bg-slate-100 transition"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-auto">
              <iframe
                src={resumeToView}
                className="h-full w-full border-0"
                title="Resume Viewer"
              />
            </div>

            {/* Footer with Download Option */}
            <div className="border-t px-6 py-4 flex justify-end gap-3">
              <a
                href={resumeToView}
                download
                className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 text-sm font-medium hover:bg-blue-700 transition"
              >
                <FileText className="h-4 w-4" />
                Download
              </a>
              <button
                onClick={() => setResumeToView(null)}
                className="rounded-lg border bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-4 rounded-lg border bg-slate-50 p-4">
      <div className="text-slate-600">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-800">{value}</p>
      </div>
    </div>
  );
}
