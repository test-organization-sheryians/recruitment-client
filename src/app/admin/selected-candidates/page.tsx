'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Phone, User, Briefcase, Loader2 } from 'lucide-react';
import { useGetUsers } from '@/features/admin/users/hooks/useUser';

interface Role {
  name: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: Role | null;
}

export default function SelectedCandidatesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
const ids = useMemo(() => {
  const idsParam = searchParams.get('ids');
  return idsParam ? idsParam.split(',') : [];
}, [searchParams]);


  const { data: allUsers = [], isLoading } = useGetUsers();
  const [selectedCandidates, setSelectedCandidates] = useState<User[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!allUsers.length || !ids.length) return;

    const filtered = allUsers.filter(user => ids.includes(user._id));
    setSelectedCandidates(filtered);

    if (!activeUserId && filtered.length > 0) {
      setActiveUserId(filtered[0]._id);
    }
  }, [allUsers, ids, activeUserId]);


const activeUser = selectedCandidates.find(u => u._id === activeUserId) || null;


  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white border hover:bg-gray-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Selected Candidates ({selectedCandidates.length})
          </h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* LEFT SIDEBAR - Candidate List */}
          <div className="col-span-4 bg-white shadow-lg border">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold">
              Shortlisted Candidates
            </div>

            <div className="divide-y">
              {selectedCandidates.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No candidates selected</div>
              ) : (
                selectedCandidates.map(user => (
                  <div
                    key={user._id}
                    onClick={() => setActiveUserId(user._id)}
                    className={`p-4 cursor-pointer transition-all border-l-4 ${
                      activeUserId === user._id
                        ? 'bg-blue-50 border-blue-600 shadow-inner'
                        : 'border-transparent hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 flex items-center justify-center font-bold text-white ${
                          activeUserId === user._id ? 'bg-blue-600' : 'bg-gray-400'
                        }`}
                      >
                        {user.firstName.charAt(0)}
                        {user.lastName.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT PANEL - Candidate Details */}
          <div className="col-span-8 bg-white shadow-lg border">
            {activeUser ? (
              <div className="p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {activeUser.firstName.charAt(0)}
                    {activeUser.lastName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {activeUser.firstName} {activeUser.lastName}
                    </h2>
                    <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200">
                      {activeUser.role?.name || 'No Role'}
                    </span>
                  </div>
                </div>

                <div className="space-y-6 mt-8">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-blue-600">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Email</p>
                      <p className="text-gray-800 font-medium">{activeUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-green-600">
                    <Phone className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-800 font-medium">
                        {activeUser.phoneNumber || 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-purple-600">
                    <Briefcase className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Role</p>
                      <p className="text-gray-800 font-medium">
                        {activeUser.role?.name || 'No Role Assigned'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 border-l-4 border-orange-600">
                    <User className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="text-sm text-gray-500 font-medium">Candidate ID</p>
                      <p className="text-gray-800 font-mono font-medium">{activeUser._id}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-8 pt-6 border-t flex gap-4">
                  <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 transition-all shadow-md hover:shadow-lg">
                    Send Email
                  </button>
                  <button className="flex-1 px-6 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all">
                    View Full Profile
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8">
                <div className="text-center text-gray-500">
                  <User className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Select a candidate to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
