'use client';

import { useState } from 'react';
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

  const candidates = data?.data ?? [];
  const [activeId, setActiveId] = useState<string | null>(
    candidates.length ? candidates[0]._id : null
  );

  const activeCandidate = candidates.find(c => c._id === activeId) || null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium border bg-white hover:bg-slate-50"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <h1 className="text-2xl font-semibold text-slate-800">
            Shared Candidates
            <span className="ml-2 text-sm font-normal text-slate-500">({candidates.length})</span>
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT LIST */}
          <aside className="col-span-4 bg-white border rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b text-sm font-semibold text-slate-700">
              Candidates
            </div>

            <div className="divide-y">
              {candidates.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-sm">No shared candidates</div>
              ) : (
                candidates.map(c => (
                  <button
                    key={c._id}
                    onClick={() => setActiveId(c._id)}
                    className={`w-full text-left px-5 py-4 transition ${
                      activeId === c._id ? 'bg-slate-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center rounded-md bg-slate-800 text-white font-semibold text-sm">
                        {c.name?.charAt(0) ?? 'C'}
                      </div>

                      <div className="min-w-0">
                        <p className="font-medium text-slate-800 truncate">
                          {c.name || 'Candidate'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{c.email || 'N/A'}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* RIGHT DETAILS */}
          <section className="col-span-8 bg-white border rounded-lg">
            {activeCandidate ? (
              <div className="p-8">
                <div className="flex items-center gap-6 pb-6 border-b">
                  <div className="w-20 h-20 rounded-lg bg-slate-800 text-white flex items-center justify-center text-2xl font-bold">
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

                <div className="grid grid-cols-2 gap-6 mt-8">
                  <InfoCard
                    icon={<Mail className="w-5 h-5" />}
                    label="Email"
                    value={activeCandidate.email || 'Not available'}
                  />

                  <InfoCard
                    icon={<User className="w-5 h-5" />}
                    label="Candidate ID"
                    value={activeCandidate.candidateId}
                    mono
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-12 text-slate-400">
                <div className="text-center">
                  <User className="w-14 h-14 mx-auto mb-4" />
                  <p className="text-sm">Select a candidate to view details</p>
                </div>
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
    <div className="flex gap-4 p-4 border rounded-lg bg-slate-50">
      <div className="text-slate-600">{icon}</div>
      <div>
        <p className="text-xs text-slate-500 font-medium">{label}</p>
        <p className={`text-sm text-slate-800 ${mono ? 'font-mono break-all' : 'font-medium'}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
