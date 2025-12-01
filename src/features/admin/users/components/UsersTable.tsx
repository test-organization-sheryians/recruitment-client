"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const { success, error } = useToast();

  // Load users
  useEffect(() => {
    setLocalUsers(users);
    setFilteredUsers(users);
  }, [users]);

  // Search filter effect  
  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const result = localUsers.filter((u) => {
      const fullName = `${u.firstName} ${u.lastName}`.toLowerCase();
      return fullName.includes(query);
    });

    setFilteredUsers(result);
  }, [searchQuery, localUsers]);

  if (isLoading) return <p className="text-center py-4">Loading users...</p>;
  if (isError) return <p className="text-center py-4 text-red-500">Failed to load users.</p>;

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
          success("Role updated successfully!");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
          setIsSaving(false);
          error("Failed to update role. Try again!");
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
          setLocalUsers((prev) => prev.filter((u) => u._id !== userId));
          success("User deleted successfully!");
        },
        onError: () => {
          error("Failed to delete user!");
        },
      }
    );
  };

  return (
    <>
      {/* 🔍 Search Bar */}
      <div className="w-full flex justify-end mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-2 border rounded-lg w-64 shadow-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Update Role</h2>

            <select
              className="w-full p-2 border rounded-lg bg-gray-100"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="6915a17ed8d70e9b7ce70ec7">Admin</option>
              <option value="692c10094167ed9d874b8f99">Client</option>
              <option value="6915ab309788ad1e00990866">Candidate</option>
            </select>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <table className="min-w-full bg-white border rounded-lg shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 border-b text-left">Name</th>
            <th className="px-6 py-3 border-b text-left">Email</th>
            <th className="px-6 py-3 border-b text-left">Phone</th>
            <th className="px-6 py-3 border-b text-left">Role</th>
            <th className="px-6 py-3 border-b">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4 text-gray-500 border-b">
                No users found
              </td>
            </tr>
          ) : (
            filteredUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-3 border-b">
                  {user.firstName} {user.lastName}
                </td>
                <td className="px-6 py-3 border-b">{user.email}</td>
                <td className="px-6 py-3 border-b">{user.phoneNumber || "N/A"}</td>
                <td className="px-6 py-3 border-b">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">
                    {user.role?.name || "No Role"}
                  </span>
                </td>

                <td className="px-6 py-3 border-b relative">
                  <div className="flex gap-3 justify-center">
                    <Pencil
                      className="text-blue-600 cursor-pointer"
                      onClick={() => openModal(user)}
                    />

                    <div className="relative">
                      <Trash2
                        className="text-red-600 cursor-pointer"
                        onClick={() =>
                          setOpenDeleteMenu(openDeleteMenu === user._id ? null : user._id)
                        }
                      />

                      {openDeleteMenu === user._id && (
                        <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-32 z-20">
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
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
        </tbody>
      </table>
    </>
  );
}
