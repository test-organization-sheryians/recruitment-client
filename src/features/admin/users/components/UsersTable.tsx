"use client";

import { Pencil, Trash2 } from "lucide-react";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  role?: {
    name: string;
  };
}

interface UsersTableProps {
  users: User[];
  activeTab: string;
  setSelectedUserForRole: (user: User) => void;
  setSelectedUserForDelete: (user: User) => void;
  currentUser?: User | null;
  updatingUserId?: string | null;
  deletingUserId?: string | null;
}

export default function UsersTable({
  users,
  activeTab,
  setSelectedUserForRole,
  setSelectedUserForDelete,
  currentUser,
  updatingUserId,
  deletingUserId,
}: UsersTableProps) {
  const roleName = typeof currentUser?.role === "string"
    ? currentUser.role
    : currentUser?.role?.name;

  const filteredUsers =
    activeTab === "All"
      ? users
      : users.filter(
          (u: User) => u.role?.name?.toLowerCase() === activeTab.toLowerCase()
        );

  const roleColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-red-500";
      case "client":
        return "bg-yellow-500";
      case "candidate":
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl shadow bg-white">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Email</th>
            <th className="px-6 py-3">Phone</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filteredUsers.map((user: User) => {
            const canModify =
              roleName === "admin" && currentUser?._id !== user._id;

            return (
              <tr
                key={user._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-3 border-b">
                  {user.firstName} {user.lastName}
                </td>

                <td className="px-6 py-3 border-b">{user.email}</td>

                <td className="px-6 py-3 border-b">
                  {user.phoneNumber || "—"}
                </td>

                <td className="px-6 py-3 border-b">
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded-full text-white text-sm ${roleColor(
                      user.role?.name || ""
                    )}`}
                  >
                    {user.role?.name || "No Role"}
                  </span>
                </td>

                <td className="px-6 py-3 border-b flex gap-2">
                  {canModify && (
                    <>
                      <button
                        onClick={() => setSelectedUserForRole(user)}
                        disabled={
                          updatingUserId === user._id ||
                          deletingUserId === user._id
                        }
                        className="p-2 rounded hover:bg-gray-200"
                        title="Edit user role"
                      >
                        <Pencil className="h-5 w-5 text-blue-600" />
                      </button>

                      <button
                        onClick={() => setSelectedUserForDelete(user)}
                        disabled={
                          deletingUserId === user._id ||
                          updatingUserId === user._id
                        }
                        className="p-2 rounded hover:bg-red-100"
                        title="Delete user"
                      >
                        <Trash2 className="h-5 w-5 text-red-600" />
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
  );
}