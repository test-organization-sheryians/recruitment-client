"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  useInfiniteUsers,
  useDeleteUser,
  useUpdateUserRole,
  User,
} from "@/features/admin/users/hooks/useUser";
import { useDebounce } from "@/features/admin/users/hooks/useDebounce";
import { useToast } from "@/components/ui/Toast";

export default function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteUsers(debouncedSearch);

  const users = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<string>("");
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
      if (searchQuery) params.set("search", searchQuery);
      else params.delete("search");
      window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
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

  /* ---------------- MODAL / ACTIONS ---------------- */
  const openModal = (user: User) => {
    setSelectedUserId(user._id);
    setSelectedRole(user.role?._id || "");
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

  if (isLoading) return <p className="text-center py-8">Loading users...</p>;
  if (isError) return <p className="text-center py-8 text-red-500">Failed to load users</p>;

  return (
    <>
      {/* SEARCH */}
      <div className="flex justify-end mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="px-4 py-2 border rounded-lg w-64"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="font-semibold mb-4">Update Role</h2>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border p-2 rounded">
              <option value="">Select Role</option>
              <option value="6915a17ed8d70e9b7ce70ec7">Admin</option>
              <option value="692c10094167ed9d874b8f99">Client</option>
              <option value="6915ab309788ad1e00990866">Candidate</option>
            </select>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button
                onClick={handleSaveRole}
                disabled={isSaving}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TABLE */}
     <table className="min-w-full bg-white border rounded">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-3 text-left">Name</th>
      <th className="p-3 text-left">Email</th>
      <th className="p-3 text-left">Phone</th>
      <th className="p-3 text-left">Role</th>
      <th className="p-3 text-center">Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.length === 0 ? (
      <tr>
        <td colSpan={5} className="text-center py-8 text-gray-500">
          {searchQuery ? "No matches found" : "No users found"}
        </td>
      </tr>
    ) : (
      users.map((user) => (
        <tr key={user._id} className="hover:bg-gray-50">
          <td className="px-6 py-4 border-b">
            {user.firstName} {user.lastName}
          </td>
          <td className="px-6 py-4 border-b">{user.email}</td>
          <td className="px-6 py-4 border-b">
            {user.phoneNumber || "N/A"}
          </td>
          <td className="px-6 py-4 border-b">
            {user.role?.name || "No Role"}
          </td>

          {/* ACTIONS */}
          <td className="px-6 py-4 border-b text-center">
            <div className="flex justify-center items-center gap-2 relative">
              <Pencil
                className="w-5 h-5 text-blue-600 cursor-pointer"
                onClick={() => openModal(user)}
              />
              <Trash2
                className="w-5 h-5 text-red-600 cursor-pointer"
                onClick={() =>
                  setOpenDeleteMenu(
                    openDeleteMenu === user._id ? null : user._id
                  )
                }
              />

              {openDeleteMenu === user._id && (
                <div className="absolute top-6 right-0 bg-white border rounded-lg shadow-lg w-32 z-20">
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
          </td>
        </tr>
      ))
    )}

    {/* Infinite scroll trigger */}
    <tr ref={loadMoreRef}>
      <td colSpan={5} className="p-0 h-4" />
    </tr>

    {isFetchingNextPage && (
      <tr>
        <td colSpan={5} className="text-center py-6 text-gray-500">
          Loading more users...
        </td>
      </tr>
    )}
  </tbody>
</table>

    </>
  );  
}
