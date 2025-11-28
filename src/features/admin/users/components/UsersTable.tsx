"use client";

import { useState } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import {
  useGetUsers,
  useDeleteUser,
  useUpdateUserRole,
} from "@/features/admin/users/hooks/useUser";

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

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");

  // Dropdown for delete
  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);

  // Loading for save button
  const [isSaving, setIsSaving] = useState(false);

  if (isLoading) return <p className="text-center py-4">Loading users...</p>;

  if (isError)
    return (
      <p className="text-center py-4 text-red-500">
        Failed to load users.
      </p>
    );

  // OPEN EDIT MODAL
  const openModal = (user: User) => {
    setSelectedUserId(user._id);
    setSelectedRole(user.role?.name || "");
    setIsModalOpen(true);
  };

  // SAVE ROLE WITH LOADING
  const handleSaveRole = () => {
    if (!selectedUserId || !selectedRole) return;
    setIsSaving(true);

    updateUserRole.mutate(
      { userId: selectedUserId, role: selectedRole },
      {
        onSuccess: () => {
          setIsSaving(false);
          setIsModalOpen(false);
        },
        onError: () => {
          setIsSaving(false);
        },
      }
    );
  };

  // DELETE USER FROM DROPDOWN
  const handleDeleteUser = (userId: string) => {
    deleteUser.mutate({ userId });
    setOpenDeleteMenu(null);
  };

  return (
    <>
      {/* ROLE EDIT MODAL */}
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
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="candidate">Candidate</option>
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

      {/* USERS TABLE */}
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
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-4 text-gray-500 border-b"
              >
                No users available
              </td>
            </tr>
          ) : (
            users.map((user: User) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-3 border-b">
                  {user.firstName} {user.lastName}
                </td>

                <td className="px-6 py-3 border-b">{user.email}</td>

                <td className="px-6 py-3 border-b">
                  {user.phoneNumber || "N/A"}
                </td>

                <td className="px-6 py-3 border-b">
                  <span className="px-2 py-1 rounded bg-blue-100 text-blue-700 text-sm">
                    {user.role?.name || "No Role"}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-3 border-b relative">
                  <div className="flex gap-3 justify-center">
                    {/* EDIT ICON */}
                    <Pencil
                      className="text-blue-600 cursor-pointer"
                      onClick={() => openModal(user)}
                    />

                    {/* DELETE WITH DROPDOWN */}
                    <div className="relative">
                      <Trash2
                        className="text-red-600 cursor-pointer"
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
