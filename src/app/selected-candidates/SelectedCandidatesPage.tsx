
'use client';

import { useShareCandidates } from '@/features/admin/users/hooks/useShareuser';
import { FileText, Home, Loader2, Mail, User, Users, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import { Experience, ShareCandidate } from '../../types/shareInterfaceCandidate';

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

function formatDate(date?: string) {
  return date ? new Date(date).toLocaleDateString() : 'Present';
}

export default function SelectedCandidatesPage() {
  const router = useRouter();
  const params = useSearchParams();
  const shareId = params.get('shareId') ?? '';
  
  // Backend data fetching
  const { data: response, isLoading } = useShareCandidates(shareId);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- SAHI MAPPING LOGIC ---
  const uiCandidates: UIShareCandidate[] = useMemo(() => {
    // Backend structure check: data.data.selectedUsers ya direct array
    const rawList = response?.data?.selectedUsers || response?.selectedUsers || (Array.isArray(response?.data) ? response.data : []);
    
    return rawList.map((c: any) => ({
      _id: c._id || Math.random().toString(),
      userId: c.userId || '',
      name: `${c.user?.firstName || c.firstName || ''} ${c.user?.lastName || c.lastName || ''}`.trim() || 'Candidate',
      email: c.user?.email || c.email || 'N/A',
      availability: c.availability || 'N/A',
      resumeFile: c.resumeFile,
      skills: (c.skills ?? []).map((skill: any) => ({
        _id: skill._id ?? '',
        name: skill.name ?? skill ?? '',
      })),
      experiences: c.experiences ?? [],
      createdAt: c.createdAt,
    }));
  }, [response]);

  const groupName = response?.groupName || response?.data?.groupName || "Shared Group";

  useEffect(() => {
    if (uiCandidates.length > 0 && !activeId) {
      setActiveId(uiCandidates[0]._id);
    }
  }, [uiCandidates, activeId]);

  const activeCandidate = uiCandidates.find(c => c._id === activeId) ?? null;

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-800">
              {groupName}
              
            </h1>
            
            <p>
              Members
              <span className="ml-2 text-sm font-normal text-slate-800">{uiCandidates.length}</span>
            </p>

          </div>

          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Home className="h-4 w-4" />
            Home
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* LEFT LIST */}
          <aside className="col-span-4 overflow-hidden rounded-xl border bg-white shadow-sm">
            <div className="border-b px-5 py-4 text-sm font-semibold text-slate-700 bg-slate-50/50">
              Candidates
            </div>

            <div className="divide-y max-h-[70vh] overflow-y-auto">
              {uiCandidates.length > 0 ? (
                uiCandidates.map(c => (
                  <button
                    key={c._id}
                    onClick={() => setActiveId(c._id)}
                    className={`w-full px-5 py-4 text-left transition ${
                      activeId === c._id
                        ? 'bg-blue-50 border-r-4 border-slate-800'
                        : 'hover:bg-slate-50'
                    }`}
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
          <section className="col-span-8 max-h-[80vh] overflow-y-auto rounded-xl border bg-white shadow-sm">
            {activeCandidate ? (
              <div className="p-8">
                <div className="flex items-center gap-6 border-b pb-6">
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-800 text-2xl font-bold text-white shadow-md">
                    {activeCandidate.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-slate-800">{activeCandidate.name}</h2>
                    <p className="mt-2 text-sm text-slate-500">
                      Shared at: {activeCandidate.createdAt ? new Date(activeCandidate.createdAt).toLocaleString() : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-6">
                  <InfoCard icon={<Mail className="h-5 w-5" />} label="Email" value={activeCandidate.email} />
                  <InfoCard icon={<User className="h-5 w-5" />} label="Availability" value={activeCandidate.availability} />

                  {activeCandidate.skills.length > 0 && (
                    <div className="col-span-2">
                      <p className="mb-2 text-sm font-semibold text-slate-700">Skills</p>
                      <div className="flex flex-wrap gap-2">
                        {activeCandidate.skills.map(skill => (
                          <span key={skill._id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border">
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
                        {activeCandidate.experiences.map((exp: any, index: number) => (
                          <div key={index} className="rounded-xl border p-4 hover:bg-slate-50 transition">
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">{exp.title || exp.position}</p>
                                <p className="text-sm text-slate-600">{exp.company || exp.companyName}</p>
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
                      <a href={activeCandidate.resumeFile} target="_blank" className="flex items-center gap-2 rounded-lg border bg-blue-50 p-4 text-blue-600 font-semibold hover:underline">
                        <FileText className="h-5 w-5" /> Download Resume
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

      {/* --- MODAL FOR GROUP MEMBERS --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b p-5">
              <h3 className="font-bold text-slate-800">Group Members</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-1 hover:bg-slate-100">
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto p-4 space-y-3">
              {uiCandidates.map(m => (
                <div key={m._id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                  <div className="h-8 w-8 rounded bg-slate-200 flex items-center justify-center text-xs font-bold">{m.name.charAt(0)}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{m.email}</p>
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

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-4 rounded-lg border bg-slate-50/50 p-4 hover:bg-white transition shadow-sm">
      <div className="text-slate-500">{icon}</div>
      <div>
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}