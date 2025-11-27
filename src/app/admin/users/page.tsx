"use client";

import { useSelector } from "react-redux";
import { useUsers } from "@/features/admin/users/hooks/useUser";

import UsersTable from "@/features/admin/users/components/UsersTable";
import RoleModal from "@/features/admin/users/components/RoleModal";
import DeleteModal from "@/features/admin/users/components/DeleteModal";

// Define a proper type for Redux state that matches your User type
interface RootState {
  auth: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

export default function UsersPage() {
  const currentUser = useSelector((state: RootState) => state?.auth?.user);

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
            onClick={() => setActiveTab(tab)}
            className={`pb-1 font-medium ${
              activeTab === tab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <UsersTable
        users={users}
        activeTab={activeTab}
        currentUser={currentUser}
        setSelectedUserForRole={setSelectedUserForRole}
        setSelectedUserForDelete={setSelectedUserForDelete}
        updatingUserId={updatingUserId}
        deletingUserId={deletingUserId}
      />

      {/* Modals */}
      <RoleModal
        selectedUserForRole={selectedUserForRole}
        tempRole={tempRole}
        setTempRole={setTempRole}
        updatingUserId={updatingUserId}
        handleRoleUpdate={handleRoleUpdate}
        setSelectedUserForRole={setSelectedUserForRole}
      />

      <DeleteModal
        selectedUserForDelete={selectedUserForDelete}
        deletingUserId={deletingUserId}
        confirmDelete={confirmDelete}
        setSelectedUserForDelete={setSelectedUserForDelete}
      />
    </div>
  );
}