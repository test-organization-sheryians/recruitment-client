"use client";

import { getAllUsers, deleteUser, updateUserRole } from "@/api";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [tempRole, setTempRole] = useState<string | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);

  // Use untyped selector for now to avoid RootState errors
  const currentUser = useSelector((state: any) => state?.auth?.user);

  // Fetch users on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res?.data || res || []);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px] text-lg">
        Loading users...
      </div>
    );
  }

  // Update role instantly in UI
  const handleInstantRoleUI = (userId: string, newRole: string) => {
    setSelectedUser((prev: any) =>
      prev ? { ...prev, role: { ...prev.role, name: newRole } } : prev
    );

    setUsers((prev) =>
      prev.map((u) =>
        u._id === userId ? { ...u, role: { ...(u.role || {}), name: newRole } } : u
      )
    );
  };

  // Safe delete handler used by modal button
  const confirmDelete = async () => {
    if (!deleteUserId) return;
    try {
      await deleteUser(deleteUserId);
      setUsers((prev) => prev.filter((u) => u._id !== deleteUserId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    } finally {
      setDeleteUserId(null);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Users</h2>

      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 border-b text-left">Name</th>
              <th className="px-6 py-3 border-b text-left">Email</th>
              <th className="px-6 py-3 border-b text-left">Phone</th>
              <th className="px-6 py-3 border-b text-left">Role</th>
              <th className="px-6 py-3 border-b text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user: any) => {
              // Admin can modify other users, but not themselves
              const canModify =
                currentUser?.role === "admin" && currentUser?._id !== user._id;

              return (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 border-b">
                    {user.firstName} {user.lastName}
                  </td>
                  <td className="px-6 py-3 border-b">{user.email}</td>
                  <td className="px-6 py-3 border-b">{user.phoneNumber || "—"}</td>
                  <td className="px-6 py-3 border-b capitalize">
                    {user.role?.name || "No Role"}
                  </td>
                  <td className="px-6 py-3 border-b flex gap-3">
                    {canModify && (
                      <>
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-2 rounded hover:bg-gray-200"
                          aria-label={`Edit role for ${user.firstName}`}
                        >
                          <PencilSquareIcon className="h-6 w-6 text-blue-600" />
                        </button>

                        <button
                          onClick={() => setDeleteUserId(user._id)}
                          className="p-2 rounded hover:bg-red-100"
                          aria-label={`Delete ${user.firstName}`}
                        >
                          <TrashIcon className="h-6 w-6 text-red-600" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ROLE CHANGE MODAL */}
      {selectedUser && currentUser?.role === "admin" && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => {
            setSelectedUser(null);
            setTempRole(null);
          }}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3">
              Change Role for {selectedUser.firstName}
            </h2>

            <div className="space-y-2">
              {["admin", "recruiter", "candidate"].map((role) => {
                const selected =
                  tempRole ? tempRole === role : selectedUser.role?.name === role;

                return (
                  <button
                    key={role}
                    onClick={() => {
                      setTempRole(role);
                      handleInstantRoleUI(selectedUser._id, role);
                    }}
                    className={`w-full px-4 py-2 border rounded capitalize ${
                      selected ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>

            <button
              onClick={async () => {
                if (tempRole) {
                  try {
                    await updateUserRole(selectedUser._id, tempRole);
                  } catch (error) {
                    console.error("Failed to update role:", error);
                  }
                }
                setSelectedUser(null);
                setTempRole(null);
              }}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>

            <button
              onClick={() => {
                setSelectedUser(null);
                setTempRole(null);
              }}
              className="mt-2 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteUserId && currentUser?.role === "admin" && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setDeleteUserId(null)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-72"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3 text-center">
              Delete User?
            </h2>

            <p className="text-gray-600 text-sm text-center">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>

              <button
                onClick={() => setDeleteUserId(null)}
                className="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
