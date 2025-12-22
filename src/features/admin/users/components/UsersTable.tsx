"use client";

import { useState, useEffect } from "react";
import { FiEdit } from "react-icons/fi";
import { Trash2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useGetUsers,
  useDeleteUser,
  useUpdateUserRole,  User,} from "@/features/admin/users/hooks/useUser";
import { useToast } from "@/components/ui/Toast";
import {
  ReusableTable,
  Column,
} from "@/features/admin/users/components/ReusableTable";

/* ================= COMPONENT ================= */

export default function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("all");

  const { data: users = [], isLoading, isError } =
    useGetUsers(selectedRoleFilter);

  const [filteredUsers, setFilteredUsers] = useState(users);

  const deleteUser = useDeleteUser();
  const updateUserRole = useUpdateUserRole();
  const queryClient = useQueryClient();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);

  /* ================= SEARCH FILTER ================= */

  useEffect(() => {
    const query = searchQuery.toLowerCase();

    const filtered = users.filter((user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  }, [searchQuery, users]);

  /* ================= HANDLERS ================= */

  const openModal = (user: User) => {
    setSelectedUserId(user._id);
    setSelectedRoleId(user.role?._id || "");
    setIsModalOpen(true);
  };

  const handleSaveRole = () => {
    if (!selectedUserId || !selectedRoleId) {
      error("Please select a role");
      return;
    }

    setIsSaving(true);

    updateUserRole.mutate(
      { userId: selectedUserId, role: selectedRoleId },
      {
        onSuccess: () => {
          setIsSaving(false);
          setIsModalOpen(false);
          success("Role updated successfully!");
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
        onError: () => error("Failed to delete user"),
      }
    );
  };

  /* ================= TABLE COLUMNS ================= */

  const columns: Column<User>[] = [
    {
      header: "Name",
      render: (user) => `${user.firstName} ${user.lastName}`,
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      render: (user) => user.phoneNumber || "N/A",
    },
    {
      header: "Role",
      render: (user) => {
        const roleName = user.role?.name;

        let bgClass = "bg-green-100 text-gray-700";
        if (roleName === "client") bgClass = "bg-red-100";
        if (roleName === "admin") bgClass = "bg-blue-100";

        return (
          <span className={`px-3 py-1 rounded-full text-xs ${bgClass}`}>
            {roleName || "No Role"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      render: (user) => (
        <div className="flex gap-3 justify-center items-center relative">
          <FiEdit
            className="text-blue-600 cursor-pointer"
            onClick={() => openModal(user)}
          />

          <Trash2
            className="text-red-600  text-xs w-4 cursor-pointer"
            onClick={() =>
              setOpenDeleteMenu(
                openDeleteMenu === user._id ? null : user._id
              )
            }
          />

          {openDeleteMenu === user._id && (
            <div className="absolute top-6 right-0 bg-white border rounded shadow w-28">
              <button
                onClick={() => handleDeleteUser(user._id)}
                className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-100"
              >
                Delete
              </button>
              <button
                onClick={() => setOpenDeleteMenu(null)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  /* ================= RENDER ================= */

  if (isLoading) return <p className="text-center">Loading users...</p>;
  if (isError)
    return <p className="text-center text-red-500">Failed to load users</p>;

  return (
    <>
      {/* Filters */}
      <div className="flex justify-end gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="px-4 py-1 border rounded-lg w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg"
          value={selectedRoleFilter}
          onChange={(e) => setSelectedRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          <option value="no role">No Role</option>
        </select>
      </div>

      <ReusableTable
        data={filteredUsers}
        columns={columns}
        emptyText="No users found"
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-80">
            <h2 className="text-lg font-semibold mb-4">Update Role</h2>

            <select
              className="w-full p-2 border rounded-lg"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              <option value="">Select Role</option>
              <option value="6915a17ed8d70e9b7ce70ec7">Admin</option>
              <option value="692c10094167ed9d874b8f99">Client</option>
              <option value="6915ab309788ad1e00990866">Candidate</option>
            </select>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveRole}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
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
    </>
  );
}
