"use client";

interface User {
  _id: string;
  firstName: string;
  role: {
    name: string;
  };
}

interface RoleModalProps {
  selectedUserForRole: User | null;
  tempRole: string | null;
  setTempRole: (role: string | null) => void;
  updatingUserId: string | null;
  handleRoleUpdate: (userId: string, role: string) => void;
  setSelectedUserForRole: (user: User | null) => void;
}

export default function RoleModal({
  selectedUserForRole,
  tempRole,
  setTempRole,
  updatingUserId,
  handleRoleUpdate,
  setSelectedUserForRole,
}: RoleModalProps) {
  if (!selectedUserForRole) return null;

  return (
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
          onClick={() => {
            if (tempRole) {
              handleRoleUpdate(selectedUserForRole._id, tempRole);
            }
          }}
          disabled={updatingUserId === selectedUserForRole._id || !tempRole}
          className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {updatingUserId === selectedUserForRole._id ? "Saving..." : "Save"}
        </button>

        <button
          onClick={() => setSelectedUserForRole(null)}
          className="mt-2 w-full py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}