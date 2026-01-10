'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Loader2, MoreVertical, Pencil, Trash2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useToast } from '@/components/ui/Toast';
import { useDebounce } from '@/features/admin/users/hooks/useDebounce';
import { useCreateShareCandidate } from '@/features/admin/users/hooks/useShareuser';
import {
  useDeleteUser,
  useInfiniteUsers,
  User,
  useUpdateUserRole,
} from '@/features/admin/users/hooks/useUser';

export default function UsersTable() {
  /* ---------------- SEARCH ---------------- */
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 400);
  const normalizedSearch = debouncedSearch.trim().replace(/\s+/g, ' ');

  /* ---------------- DATA ---------------- */
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteUsers(normalizedSearch);

  const users = useMemo(() => data?.pages.flatMap(p => p.data) ?? [], [data]);

  /* ---------------- SELECTION ---------------- */
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const toggleUserSelection = (id: string) => {
    setSelectedUserIds(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };

  /* ---------------- SHARE ---------------- */
  const { mutate: shareCandidates, isPending } = useCreateShareCandidate();

  /* ---------------- ACTION STATE ---------------- */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState('');
  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadMoreRef = useRef<HTMLTableRowElement | null>(null);

  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();
  const queryClient = useQueryClient();
  const { success, error } = useToast();
  const router = useRouter();

  /* ---------------- URL SYNC ---------------- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    searchQuery ? params.set('search', searchQuery) : params.delete('search');
    window.history.replaceState(null, '', `?${params.toString()}`);
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

  /* ---------------- EDIT ROLE ---------------- */
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
          success('Role updated successfully');
          queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => {
          setIsSaving(false);
          error('Failed to update role');
        },
      }
    );
  };

  /* ---------------- DELETE ---------------- */
  const handleDeleteUser = (userId: string) => {
    deleteUser.mutate(
      { userId },
      {
        onSuccess: () => {
          setOpenDeleteMenu(null);
          success('User deleted successfully');
          queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => error('Failed to delete user'),
      }
    );
  };

  /* ---------------- SHARE ---------------- */
  const handleViewSelected = () => {
    if (selectedUserIds.length === 0) {
      error('Please select at least one user');
      return;
    }
    const payload = selectedUserIds.map(id => ({ candidateId: id }));
    shareCandidates(payload, {
      onSuccess: res => {
        success('Candidates shared successfully');
        setSelectedUserIds([]);
        const shareId = res.shareLink.split('/').pop();
        router.push(`/selected-candidates?shareId=${shareId}`);
      },
      onError: () => error('Failed to share candidates'),
    });
  };

  /* ---------------- STATES ---------------- */
  if (isLoading) return <p className="py-10 text-center">Loading users…</p>;
  if (isError) return <p className="py-10 text-center text-red-500">Failed to load users</p>;

  return (
    <>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search by name or email…"
          className="w-64 rounded-lg border-3 px-4 py-2"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <button
          onClick={handleViewSelected}
          disabled={selectedUserIds.length === 0 || isPending}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          <Users className="h-4 w-4" />
          Share Selected ({selectedUserIds.length})
        </button>
      </div>

      {/* TABLE */}
      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-100 text-sm">
            <tr>
              <th className="px-4 py-3 text-center">Select</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Phone</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selectedUserIds.includes(user._id)}
                    onChange={() => toggleUserSelection(user._id)}
                    className="h-4 w-4 accent-blue-600"
                  />
                </td>

                <td className="px-4 py-3 font-medium">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-4 py-3">{user.email}</td>
                <td className="px-4 py-3">{user.phoneNumber || 'N/A'}</td>
                <td className="px-4 py-3">{user.role?.name || 'No Role'}</td>

                <td className="relative px-4 py-3 text-center">
                  <button
                    onClick={() => setOpenDeleteMenu(prev => (prev === user._id ? null : user._id))}
                    className="rounded-md p-2 hover:bg-gray-100"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>

                  {openDeleteMenu === user._id && (
                    <div className="absolute right-6 top-10 z-20 w-36 rounded-lg border bg-white shadow-lg">
                      <button
                        onClick={() => openModal(user)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            <tr ref={loadMoreRef}>
              <td colSpan={6} />
            </tr>

            {isFetchingNextPage && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  Loading more users…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ROLE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-xl bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold">Update Role</h2>

            <select
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
              className="w-full rounded-lg border px-3 py-2"
            >
              <option value="">Select role</option>
              <option value="6915a17ed8d70e9b7ce70ec7">Admin</option>
              <option value="692c10094167ed9d874b8f99">Client</option>
              <option value="6915ab309788ad1e00990866">Candidate</option>
            </select>

            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button
                onClick={handleSaveRole}
                disabled={isSaving}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
