"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useInfiniteUsers,
  useDeleteUser,
  useUpdateUserRole,
} from "@/features/admin/users/hooks/useUser";
import { useToast } from "@/components/ui/Toast";

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
  const {
    data: userPages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUsers();

  const users = useMemo(
    () => (userPages?.pages ?? []).flatMap((p) => p.data ?? []),
    [userPages]
  );

  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Infinite scroll sentinel ref
  const loadMoreRef = useRef<HTMLTableRowElement | null>(null);

  // Filter users based on search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(query);
    });
  }, [users, searchQuery]);

  // Infinite scroll observer
  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const openModal = (user: User) => {
    setSelectedUserId(user._id);
    setSelectedRole(user.role?.name || "");
    setIsModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!selectedUserId || !selectedRole) {
      error("Please select a role");
      return;
    }

    setIsSaving(true);

    updateUserRole.mutate(
      { userId: selectedUserId, role: selectedRole },
      {
        onSuccess: () => {
          setIsSaving(false);
          setIsModalOpen(false);
          success("Role updated successfully");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
          setIsSaving(false);
          error("Failed to update role");
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
          success("User deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
          error("Failed to delete user!");
        },
        onError: () => error("Failed to delete user"),
      }
    );
  };

  if (isLoading) return <p className="text-center py-8">Loading users...</p>;
  if (isError)
    return (
      <p className="text-center py-8 text-red-500">Failed to load users.</p>
    );

  return (
    <>
      {/* Search Input */}
      <div className="w-full flex justify-end mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 border rounded-lg w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Role Update Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Update Role</h2>

            <select
              className="w-full p-2 border rounded-lg bg-gray-50"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="6915a17ed8d70e9b7ce70ec7">Admin</option>
              <option value="692c10094167ed9d874b8f99">Client</option>
              <option value="6915ab309788ad1e00990866">Candidate</option>
            </select>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveRole}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-70"
              >
                {isSaving ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  "Save"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg shadow">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
                Name
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
                Email
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
                Phone
              </th>
              <th className="px-6 py-3 border-b text-left text-sm font-medium text-gray-700">
                Role
              </th>
              <th className="px-6 py-3 border-b text-center text-sm font-medium text-gray-700">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-8 text-gray-500 border-b"
                >
                  {searchQuery ? "No users match your search" : "No users found"}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 border-b">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-4 border-b">{user.email}</td>
                  <td className="px-6 py-4 border-b">
                    {user.phoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 border-b">
                    <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm">
                      {user.role?.name || "No Role"}
                    </span>
                  </td>
                  <td className="px-6 py-4 border-b">
                    <div className="flex gap-4 justify-center items-center">
                      <Pencil
                        className="w-5 h-5 text-blue-600 cursor-pointer hover:text-blue-800"
                        onClick={() => openModal(user)}
                      />

                      <div className="relative">
                        <Trash2
                          className="w-5 h-5 text-red-600 cursor-pointer hover:text-red-800"
                          onClick={() =>
                            setOpenDeleteMenu(
                              openDeleteMenu === user._id ? null : user._id
                            )
                          }
                        />

                        {openDeleteMenu === user._id && (
                          <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-32 z-20">
                            <button
                              onClick={() => handleDeleteUser(user._id)}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setOpenDeleteMenu(null)}
                              className="w-full text-left px-4 py-2 hover:bg-gray-100"
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

            {/* Infinite scroll sentinel */}
            <tr ref={loadMoreRef}>
              <td colSpan={5} className="p-0 h-4" />
            </tr>

            {isFetchingNextPage && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                  <span className="ml-2">Loading more users...</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}