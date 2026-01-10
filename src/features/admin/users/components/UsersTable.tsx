'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Pencil, Trash2, Loader2, Check, Users } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import {
  useInfiniteUsers,
  useDeleteUser,
  useUpdateUserRole,
  User,
} from '@/features/admin/users/hooks/useUser';
import { useDebounce } from '@/features/admin/users/hooks/useDebounce';
import { useToast } from '@/components/ui/Toast';
import { useCreateShareCandidate } from '@/features/admin/users/hooks/useShareuser';

export default function UsersTable() {
  /* ---------------- SEARCH ---------------- */
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);

  const normalizedSearch = debouncedSearch.trim().split(/\s+/).join(' ');

  /* ---------------- DATA ---------------- */
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUsers(normalizedSearch);

  const users = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data]);

  /* ---------------- NEW: SELECTION ---------------- */
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  const toggleUserSelection = (id: string) => {
    setSelectedUserIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  /* ---------------- SHARE ---------------- */
  const { mutate: shareCandidates, isPending } = useCreateShareCandidate();
  const router = useRouter();

  /* ---------------- EXISTING STATE ---------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadMoreRef = useRef<HTMLTableRowElement | null>(null);

  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  /* ---------------- URL SYNC ---------------- */
  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (searchQuery) params.set('search', searchQuery);
      else params.delete('search');
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  /* ---------------- INFINITE SCROLL ---------------- */
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  /* ---------------- MODAL ---------------- */
  const openModal = (user: User) => {
    setSelectedUserId(user._id);
    setSelectedRole(user.role?._id || '');
    setIsModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!selectedUserId || !selectedRole) {
      error('Please select a role');
      return;
    }
    setIsSaving(true);
    updateUserRole.mutate(
      { userId: selectedUserId, role: selectedRole },
      {
        onSuccess: () => {
          setIsSaving(false);
          setIsModalOpen(false);
          success('Role updated successfully!');
          queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => {
          setIsSaving(false);
          error('Failed to update role');
        },
      }
    );
  };

  const handleDeleteUser = (userId: string) => {
    deleteUser.mutate(
      { userId },
      {
        onSuccess: () => {
          setOpenDeleteMenu(null);
          success('User deleted successfully!');
          queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => error('Failed to delete user'),
      }
    );
  };

  /* ---------------- NEW: VIEW SELECTED ---------------- */
 const handleViewSelected = () => {
   if (isPending) return;

   if (selectedUserIds.length === 0) {
     error('Please select at least one user');
     return;
   }

   const payload = selectedUserIds.map(id => ({ candidateId: id }));

   shareCandidates(payload, {
     onSuccess: () => {
       success('Candidates shared successfully');
       setSelectedUserIds([]);
      //  router.push('/admin/selected-candidates');
     },
     onError: () => {
       error('Failed to share candidates');
     },
   });
 };


  /* ---------------- STATES ---------------- */
  if (isLoading) return <p className="text-center py-8">Loading users...</p>;
  if (isError) return <p className="text-center py-8 text-red-500">Failed to load users</p>;

  return (
    <>
      {/* SEARCH + VIEW SELECTED */}
      <div className="flex justify-between mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="px-4 py-2 border rounded-lg w-64"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <button
          onClick={handleViewSelected}
          disabled={selectedUserIds.length === 0 || isPending}
          className={`flex items-center gap-2 px-4 py-2 text-white ${
            selectedUserIds.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Users className="w-4 h-4" />
          View Selected ({selectedUserIds.length})
        </button>
      </div>

      {/* TABLE */}
      <table className="min-w-full bg-white border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-center">Select</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Phone</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-center">
                <div
                  onClick={() => toggleUserSelection(user._id)}
                  className={`w-5 h-5 border-2 cursor-pointer flex items-center justify-center ${
                    selectedUserIds.includes(user._id)
                      ? 'bg-blue-600 border-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {selectedUserIds.includes(user._id) && <Check className="w-3 h-3 text-white" />}
                </div>
              </td>

              <td className="px-6 py-4">
                {user.firstName} {user.lastName}
              </td>
              <td className="px-6 py-4">{user.email}</td>
              <td className="px-6 py-4">{user.phoneNumber || 'N/A'}</td>
              <td className="px-6 py-4">{user.role?.name || 'No Role'}</td>

              <td className="px-6 py-4 text-center">
                <div className="flex justify-center gap-2">
                  <Pencil
                    className="w-5 h-5 text-blue-600 cursor-pointer"
                    onClick={() => openModal(user)}
                  />
                  <Trash2
                    className="w-5 h-5 text-red-600 cursor-pointer"
                    onClick={() => setOpenDeleteMenu(user._id)}
                  />
                </div>
              </td>
            </tr>
          ))}

          <tr ref={loadMoreRef}>
            <td colSpan={6} className="h-4" />
          </tr>

          {isFetchingNextPage && (
            <tr>
              <td colSpan={6} className="text-center py-6 text-gray-500">
                Loading more users...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}
