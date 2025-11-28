"use client";

import { useSelector } from "react-redux";
import { useUsers } from "@/features/admin/users/hooks/useUser";
import { Pencil, Trash2 } from "lucide-react";

interface Role {
  name: string;
}

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: Role | null;
  phoneNumber?: string;
}

interface RootState {
  auth: {
    user: User;
  };
}

function roleColor(role: string) {
  switch (role) {
    case "admin":
      return "bg-blue-600";
    case "client":
      return "bg-green-600";
    case "candidate":
      return "bg-purple-600";
    default:
      return "bg-gray-500";
  }
}

export default function UsersPage() {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const {
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
  } = useUsers();

  const tabs = ["All", "Admin", "Client", "Candidate"];

  const filteredUsers =
    activeTab === "All"
      ? users
      : users.filter(
        (u) => u.role?.name?.toLowerCase() === activeTab.toLowerCase()
      );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[300px] text-lg">
        Loading users...
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Users</h2>

      {/* Tabs */}
      <div className="flex gap-4 mb-4 border-b pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`pb-1 font-medium ${activeTab === tab
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-blue-600"
              }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl shadow bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Phone</th>
              <th className="px-6 py-3 text-left">Role</th>
              <th className="px-6 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user: User) => {

              const roleName =
                typeof user.role === "string"
                  ? user.role
                  : user.role?.name ?? "No Role";

              return (
                <tr key={user._id} className="hover:bg-gray-50 transition">

                  <td className="px-6 py-3 border-b">
                    {user.firstName} {user.lastName}
                  </td>

                  <td className="px-6 py-3 border-b">{user.email}</td>

                  <td className="px-6 py-3 border-b">
                    {user.phoneNumber ?? "—"}
                  </td>

                  <td className="px-6 py-3 border-b">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-white text-sm ${roleColor(
                        roleName
                      )}`}
                    >
                      {roleName}
                    </span>
                  </td>

                  <td className="px-6 py-3 border-b flex gap-2">
                    <button
                      onClick={() => setSelectedUserForRole(user)}
                      className="p-2 rounded hover:bg-gray-200"
                      disabled={
                        updatingUserId === user._id ||
                        deletingUserId === user._id
                      }
                    >
                      <Pencil className="h-5 w-5 text-blue-600" />
                    </button>

                    <button
                      onClick={() => setSelectedUserForDelete(user)}
                      className="p-2 rounded hover:bg-red-100"
                      disabled={
                        deletingUserId === user._id ||
                        updatingUserId === user._id
                      }
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>

        </table>
      </div>


      {selectedUserForRole && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => {
            setSelectedUserForRole(null);
            setTempRole(null);
          }}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-64"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3">
              Change Role for {selectedUserForRole.firstName}
            </h2>

            <div className="space-y-2">
              {["admin", "client", "candidate"].map((role) => {
                const selected = tempRole
                  ? tempRole === role
                  : selectedUserForRole.role?.name === role;

                return (
                  <button
                    key={role}
                    onClick={() => setTempRole(role)}
                    className={`w-full px-4 py-2 border rounded capitalize ${selected ? "bg-blue-500 text-white" : "hover:bg-gray-100"
                      }`}
                  >
                    {role}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                handleRoleUpdate(selectedUserForRole._id, tempRole!)
              }
              disabled={updatingUserId === selectedUserForRole._id}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {updatingUserId === selectedUserForRole._id
                ? "Saving..."
                : "Save"}
            </button>

            <button
              onClick={() => {
                setSelectedUserForRole(null);
                setTempRole(null);
              }}
              className="mt-2 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {selectedUserForDelete && (
        <div
          className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
          onClick={() => setSelectedUserForDelete(null)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-lg w-72"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold mb-3 text-center">
              Delete User?
            </h2>

            <p className="text-gray-600 text-sm text-center">
              Are you sure you want to delete this user?
            </p>

            <div className="mt-5 flex gap-3">
              <button
                onClick={confirmDelete}
                disabled={deletingUserId === selectedUserForDelete._id}
                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {deletingUserId === selectedUserForDelete._id
                  ? "Deleting..."
                  : "Delete"}
              </button>

              <button
                onClick={() => setSelectedUserForDelete(null)}
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
