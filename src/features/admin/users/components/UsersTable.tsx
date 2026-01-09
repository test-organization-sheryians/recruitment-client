'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Check, Edit3, Loader2, Trash2, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useToast } from '@/components/ui/Toast';
import {
  useDeleteUser,
  useGetUsers,
  useUpdateUserRole,
} from '@/features/admin/users/hooks/useUser';

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

export default function UsersTable() {
  const { data: users = [], isLoading, isError } = useGetUsers();
  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>('');

  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const { success, error } = useToast();

  // Load users
  useEffect(() => {
    setLocalUsers(users);
    setFilteredUsers(users);
  }, [users]);

  // Search filter effect
  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const result = localUsers.filter(u => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return fullName.includes(query);
    });

    setFilteredUsers(result);
  }, [searchQuery, localUsers]);

  // Handle candidate selection
  const toggleCandidateSelection = (userId: string) => {
    setSelectedCandidates(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  // Navigate to selected candidates page
  const handleViewSelectedCandidates = () => {
    if (selectedCandidates.length === 0) {
      error('Please select at least one candidate');
      return;
    }
    router.push(`/admin/selected-candidates?ids=${selectedCandidates.join(',')}`);
  };

  if (isLoading) return <p className="text-center py-4">Loading users...</p>;
  if (isError) return <p className="text-center py-4 text-red-500">Failed to load users.</p>;

  const openModal = (user: User) => {
    setSelectedUserId(user._id);
    setSelectedRole(user.role?.name || '');
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
          error('Failed to update role. Try again!');
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
          setLocalUsers(prev => prev.filter(u => u._id !== userId));
          success('User deleted successfully!');
        },
        onError: () => {
          error('Failed to delete user!');
        },
      }
    );
  };

  return (
    <>
      <div className="w-full flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 border border-gray-300 w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center gap-3">
          <button
            onClick={handleViewSelectedCandidates}
            disabled={selectedCandidates.length === 0}
            className={`flex items-center gap-2 px-4 py-2 text-white font-medium transition-all ${
              selectedCandidates.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <Users className="w-4 h-4" />
            View Selected ({selectedCandidates.length})
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 shadow-2xl w-80">
            <h2 className="text-lg font-semibold mb-4">Update Role</h2>

            <select
              className="w-full p-2 border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={selectedRole}
              onChange={e => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="6915a17ed8d70e9b7ce70ec7">Admin</option>
              <option value="692c10094167ed9d874b8f99">Client</option>
              <option value="6915ab309788ad1e00990866">Candidate</option>
            </select>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveRole}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <table className="min-w-full bg-white border shadow-sm">
        <thead>
          <tr className="bg-gray-50 border-b-2 border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Select</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500 border-b">
                No users found
              </td>
            </tr>
          ) : (
            filteredUsers.map(user => (
              <tr key={user._id} className="hover:bg-gray-50 border-b transition-colors">
                <td className="px-6 py-3">
                  <div
                    onClick={() => toggleCandidateSelection(user._id)}
                    className={`w-5 h-5 border-2 cursor-pointer flex items-center justify-center transition-all ${
                      selectedCandidates.includes(user._id)
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 hover:border-blue-400'
                    }`}
                  >
                    {selectedCandidates.includes(user._id) && (
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    )}
                  </div>
                </td>
                <td className="px-6 py-3 font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-3 text-gray-600">{user.email}</td>
                <td className="px-6 py-3 text-gray-600">{user.phoneNumber || 'N/A'}</td>
                <td className="px-6 py-3">
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium border border-blue-200">
                    {user.role?.name || 'No Role'}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {selectedCandidates.includes(user._id) ? (
                    <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-medium border border-green-200">
                      Shortlisted
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-medium border border-gray-200">
                      Not Selected
                    </span>
                  )}
                </td>

                <td className="px-6 py-3 relative">
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => openModal(user)}
                      className="p-2 hover:bg-blue-50 text-blue-600 transition-colors group"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" strokeWidth={2} />
                    </button>

                    <div className="relative">
                      <button
                        onClick={() =>
                          setOpenDeleteMenu(openDeleteMenu === user._id ? null : user._id)
                        }
                        className="p-2 hover:bg-red-50 text-red-600 transition-colors group"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      </button>

                      {openDeleteMenu === user._id && (
                        <div className="absolute right-0 mt-2 bg-white border shadow-lg w-36 z-20">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-sm font-medium transition-colors"
                          >
                            Confirm Delete
                          </button>
                          <button
                            onClick={() => setOpenDeleteMenu(null)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700 text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
