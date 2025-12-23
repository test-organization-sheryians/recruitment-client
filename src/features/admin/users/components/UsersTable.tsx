"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";

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
  const router = useRouter();
  const searchParams = useSearchParams();

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

  // ✅ READ SEARCH FROM URL ON LOAD
  const initialQuery = searchParams.get("query") ?? "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState("");
  const [openDeleteMenu, setOpenDeleteMenu] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const loadMoreRef = useRef<HTMLTableRowElement | null>(null);

  // ✅ FRONTEND FILTER (UNCHANGED)
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;

    const q = searchQuery.toLowerCase();
    return users.filter(
      (u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }, [users, searchQuery]);

  // ✅ UPDATE PAGE URL (THIS WORKS)
  useEffect(() => {
    const params = new URLSearchParams();

    if (searchQuery.trim()) {
      params.set("query", searchQuery);
    }

    router.replace(
      `/admin/users${params.toString() ? `?${params}` : ""}`,
      { scroll: false }
    );
  }, [searchQuery, router]);

  // Infinite scroll
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

  if (isLoading) return <p className="text-center py-8">Loading users...</p>;
  if (isError)
    return (
      <p className="text-center py-8 text-red-500">
        Failed to load users.
      </p>
    );

  return (
    <>
      {/* Search */}
      <div className="flex justify-end mb-6">
        <input
          className="px-4 py-2 border rounded-lg w-64"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <table className="w-full border rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-left">Email</th>
            <th className="p-3 text-left">Role</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} className="border-t">
              <td className="p-3">
                {user.firstName} {user.lastName}
              </td>
              <td className="p-3">{user.email}</td>
              <td className="p-3">{user.role?.name || "No Role"}</td>
              <td className="p-3 text-center">
                <Trash2
                  className="inline cursor-pointer text-red-600"
                  onClick={() =>
                    deleteUser.mutate({ userId: user._id })
                  }
                />
              </td>
            </tr>
          ))}

          <tr ref={loadMoreRef} />
        </tbody>
      </table>

      {isFetchingNextPage && (
        <div className="text-center py-6">
          <Loader2 className="animate-spin mx-auto" />
        </div>
      )}
    </>
  );
}
