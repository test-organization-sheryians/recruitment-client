"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import {
  useGetUsers,
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
  const { data: users = [], isLoading, isError } = useGetUsers();
  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setLocalUsers(users);
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    const q = searchQuery.toLowerCase();
    setFilteredUsers(
      localUsers.filter((u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, localUsers]);

  if (isLoading)
    return <p className="text-center py-10 text-gray-500">Loading users…</p>;

  if (isError)
    return (
      <p className="text-center py-10 text-red-500">
        Failed to load users
      </p>
    );

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
          setLocalUsers((prev) => prev.filter((u) => u._id !== userId));
          setOpenDeleteMenu(null);
          success("User deleted");
        },
        onError: () => error("Failed to delete user"),
      }
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Users Management
        </h2>

        <input
          type="text"
          placeholder="Search users..."
          className="w-full md:w-72 rounded-xl border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b sticky top-0 z-10">
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase">
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {filteredUsers.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-gray-500"
                >
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.email}
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {user.phoneNumber || "—"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {user.role?.name || "No Role"}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3 relative">
                      <button
                        className="p-2 rounded-lg hover:bg-blue-100"
                        onClick={() => openModal(user)}
                      >
                        <Pencil className="w-4 h-4 text-blue-600" />
                      </button>

                      <button
                        className="p-2 rounded-lg hover:bg-red-100"
                        onClick={() =>
                          setOpenDeleteMenu(
                            openDeleteMenu === user._id
                              ? null
                              : user._id
                          )
                        }
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>

                      {openDeleteMenu === user._id && (
                        <div className="absolute right-0 top-10 w-32 rounded-lg border bg-white shadow-lg z-20">
                          <button
                            onClick={() =>
                              handleDeleteUser(user._id)
                            }
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setOpenDeleteMenu(null)}
                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-96 rounded-2xl shadow-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              Update User Role
            </h3>

            <select
              className="w-full rounded-xl border border-gray-300 px-3 py-2 mb-6 focus:ring-2 focus:ring-blue-500"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="6915a17ed8d70e9b7ce70ec7">
                Admin
              </option>
              <option value="692c10094167ed9d874b8f99">
                Client
              </option>
              <option value="6915ab309788ad1e00990866">
                Candidate
              </option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveRole}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white flex items-center gap-2 hover:bg-blue-700"
              >
                {isSaving && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
