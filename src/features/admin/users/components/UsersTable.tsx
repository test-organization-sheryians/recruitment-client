"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { useQueryClient } from "@tanstack/react-query";

import {
  useInfiniteUsers,
  useDeleteUser,
  useUpdateUserRole,
} from "@/features/admin/users/hooks/useUser";
import { useToast } from "@/components/ui/Toast";
import Table, { Column } from "@/components/ui/Table";

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
  const [roleFilter, setRoleFilter] = useState<string>("");
  const {
    data: userPages,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUsers(undefined, roleFilter);

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

  // Helper for role badge color classes
  const getRoleBadgeClass = (roleName?: string | null) => {
    const name = (roleName || "").toLowerCase();

    if (!name) return "bg-red-100 text-red-700"; // No role -> red
    if (name === "admin") return "bg-green-100 text-green-700"; // Admin -> green
    if (name === "candidate") return "bg-blue-100 text-blue-700"; // Candidate -> blue
    if (name === "client") return "bg-yellow-100 text-yellow-700"; // Client -> yellow

    // Default badge
    return "bg-gray-100 text-gray-700";
  };

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

  // Table column definitions (re-usable)
  const columns: Column<User>[] = [
    {
      header: "Name",
      render: (u) => (
        <>
          {u.firstName} {u.lastName}
        </>
      ),
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Phone",
      render: (u) => u.phoneNumber || "N/A",
    },
    {
      header: "Role",
      render: (u) => (
        <span
          className={`px-3 py-1 rounded-full text-sm ${getRoleBadgeClass(u.role?.name)}`}
          title={u.role?.name || "No Role"}
        >
          {u.role?.name || "No Role"}
        </span>
      ),
    },
    {
      header: "Actions",
      align: "center",
      render: (u) => (
        <div className="flex items-center gap-4 justify-center">
          <button onClick={() => openModal(u)} className="p-1">
            <FiEdit className="w-4 h-4 text-blue-600 hover:text-blue-800" />
          </button>

          <div className="relative">
            <button
              onClick={() =>
                setOpenDeleteMenu(openDeleteMenu === u._id ? null : u._id)
              }
              className="p-1"
            >
              <Trash2 className="w-4 h-4 text-red-600 hover:text-red-800" />
            </button>

            {openDeleteMenu === u._id && (
              <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-32 z-20">
                <button
                  onClick={() => handleDeleteUser(u._id)}
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
      ),
    },
  ];

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
          success("User deleted successfully!");
          queryClient.invalidateQueries({ queryKey: ["users"] });
        },
        onError: () => {
          error("Failed to delete user!");
        },
      }
    );
  };

  if (isLoading) return <p className="text-center py-8">Loading users...</p>;
  if (isError)
    return (
      <p className="text-center py-8 text-red-500">Failed to load users.</p>
    );

  return (
    <div className="-mx-6">
      {/* Search Input & Role Filter */}
      <div className="w-full flex justify-end items-center gap-4 mb-6">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg bg-white shadow-sm focus:outline-none"
        >
          <option value="">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Client">Client</option>
          <option value="Candidate">Candidate</option>
        </select>

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

      {/* Users Table: replaced with reusable `Table` component */}
      <Table<User>
        columns={columns}
        data={filteredUsers}
        rowKey={(u: User) => u._id}
        loadMoreRef={loadMoreRef}
        isFetchingNextPage={isFetchingNextPage}
        emptyMessage={searchQuery ? "No users match your search" : "No users found"}
      />
    </div>
  );
}