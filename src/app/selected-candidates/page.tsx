'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, User, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useShareCandidates } from '@/features/admin/users/hooks/useShareuser';

interface ShareCandidate {
  _id: string;
  candidateId: string;
  email?: string;
  name?: string;
  createdAt?: string;
}

export default function SelectedCandidatesPage() {
  const router = useRouter();
  const { data, isLoading } = useShareCandidates();

  const candidates: ShareCandidate[] = data?.data ?? [];

  const [activeId, setActiveId] = useState<string | null>(null);

  /* ✅ FIX: auto-select first candidate when data loads */
  useEffect(() => {
    if (candidates.length > 0 && !activeId) {
      setActiveId(candidates[0]._id);
    }
  }, [candidates, activeId]);

  const activeCandidate = candidates.find(c => c._id === activeId) ?? null;

  /* ---------------- LOADING ---------------- */
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-slate-600" />
      </div>
    );
  }

  /* ---------------- EMPTY ---------------- */
  if (!isLoading && candidates.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-slate-50">
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
        {/* HEADER */}
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
                      {c.name?.charAt(0) ?? 'C'}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-medium text-slate-800">{c.name || 'Candidate'}</p>
                      <p className="truncate text-xs text-slate-500">{c.email || 'N/A'}</p>
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
                    {activeCandidate.name?.charAt(0) ?? 'C'}
                  </div>

                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800">
                      {activeCandidate.name || 'Candidate'}
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
                    value={activeCandidate.email || 'Not available'}
                  />

                  <InfoCard
                    icon={<User className="h-5 w-5" />}
                    label="Candidate ID"
                    value={activeCandidate.candidateId}
                    mono
                  />
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

/* ---------- SMALL UI COMPONENT ---------- */
function InfoCard({
  icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex gap-4 rounded-lg border bg-slate-50 p-4">
      <div className="text-slate-600">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <p className={`text-sm text-slate-800 ${mono ? 'break-all font-mono' : 'font-medium'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
