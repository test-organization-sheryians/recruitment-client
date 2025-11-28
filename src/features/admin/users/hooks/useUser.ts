"use client";

import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUserRole } from "@/api";
import { toast } from "react-toastify";

// Define proper TypeScript interfaces
interface UserRole {
  name: string;
}

interface User {
  _id: string;
  role: UserRole;
  // Add other user properties as needed
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedUserForRole, setSelectedUserForRole] = useState<User | null>(null);
  const [tempRole, setTempRole] = useState<string | null>(null);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  const [selectedUserForDelete, setSelectedUserForDelete] = useState<User | null>(null);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res?.data || res || []);
      } catch {
        toast.error("Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleInstantRoleUI = (userId: string, newRole: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, role: { ...(u.role || {}), name: newRole } } : u
      )
    );
  };

  const handleRoleUpdate = async (id: string, newRole: string) => {
    try {
      setUpdatingUserId(id);
      await updateUserRole(id, newRole);

      handleInstantRoleUI(id, newRole);
      toast.success("User role updated!");
    } catch {
      toast.error("Failed to update user role");
    } finally {
      setUpdatingUserId(null);
      setSelectedUserForRole(null);
      setTempRole(null);
    }
  };

  const confirmDelete = async () => {
    if (!selectedUserForDelete) return;

    try {
      setDeletingUserId(selectedUserForDelete._id);
      await deleteUser(selectedUserForDelete._id);

      setUsers((prev) => prev.filter((u) => u._id !== selectedUserForDelete._id));
      toast.success("User deleted");
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setDeletingUserId(null);
      setSelectedUserForDelete(null);
    }
  };

  return {
    users,
    isLoading,
    activeTab,
    selectedUserForRole,
    tempRole,
    updatingUserId,
    selectedUserForDelete,
    deletingUserId,

    setActiveTab,
    setTempRole,
    setSelectedUserForRole,
    setSelectedUserForDelete,

    handleRoleUpdate,
    confirmDelete,
  };
}