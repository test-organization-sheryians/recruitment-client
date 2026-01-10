'use client';

import { useShareCandidates } from '@/features/admin/users/hooks/useShareuser';
import { ArrowLeft, FileText, Loader2, Mail, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UIShareCandidate {
  _id: string;
  userId: string;
  name: string;
  email: string;
  availability: string;
  resumeFile?: string;
  skills: { _id: string; name: string }[];
  experiences: any[];
  createdAt?: string;
}

export default function SelectedCandidatesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const shareId = params.get('shareId');

  const { data, isLoading } = useShareCandidates(shareId!);

  const candidates: UIShareCandidate[] =
    data?.data.map((c: any) => ({
      _id: c._id,
      userId: c.userId,
      name: `${c.user.firstName} ${c.user.lastName}`,
      email: c.user.email,
      availability: c.availability,
      resumeFile: c.resumeFile,
      skills: c.skills || [],
      experiences: c.experiences || [],
      createdAt: c.createdAt,
    })) ?? [];

  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (candidates.length > 0 && !activeId) {
      setActiveId(candidates[0]._id);
    }
  }, [candidates, activeId]);

  const activeCandidate = candidates.find(c => c._id === activeId) ?? null;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  if (!isLoading && candidates.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-100">
        <User className="mb-4 h-12 w-12 text-slate-400" />
        <p className="text-sm text-slate-500">No shared candidates found</p>
        <button
          onClick={() => router.back()}
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
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>

          <h1 className="text-2xl font-semibold text-slate-800">
            Shared Candidates
            <span className="ml-2 text-sm font-normal text-slate-500">({candidates.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT LIST */}
          <aside className="col-span-4 overflow-hidden rounded-xl border bg-white">
            <div className="border-b px-5 py-4 text-sm font-semibold text-slate-700">
              Candidates
            </div>

            <div className="divide-y">
              {candidates.map(c => (
                <button
                  key={c._id}
                  onClick={() => setActiveId(c._id)}
                  className={`w-full px-5 py-4 text-left transition ${
                    activeId === c._id ? 'bg-slate-100' : 'hover:bg-slate-50'
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
          <section className="col-span-8 rounded-xl border bg-white">
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
                      Shared at:{' '}
                      {activeCandidate.createdAt
                        ? new Date(activeCandidate.createdAt).toLocaleString()
                        : 'N/A'}
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

                  {activeCandidate.resumeFile && (
                    <div className="col-span-2">
                      <a
                        href={activeCandidate.resumeFile}
                        target="_blank"
                        className="flex items-center gap-2 rounded-lg border bg-slate-50 p-4 text-blue-600 hover:underline"
                      >
                        <FileText className="h-5 w-5" />
                        Download Resume
                      </a>
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
