"use client";

import { useState } from "react";
import { useGroups } from "@/features/admin/group/hooks/useGroups";
import CreateGroupModal from "@/features/admin/group/components/CreateGroupModal";
import GroupCard from "@/features/admin/group/components/GroupCard";

export default function GroupsPage() {
  const { data, isLoading } = useGroups();
  const [open, setOpen] = useState(false);

  const groups = data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Groups & Members Management
          </h1>
          <p className="text-gray-500 text-sm">
            Manage organizational structures and assign user permissions.
          </p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          + Create New Group
        </button>
      </div>

      {/* Groups List */}
      <div className="space-y-4">
        {isLoading && <p>Loading groups...</p>}

        {groups.map((group: any) => (
          <GroupCard key={group._id} group={group} />
        ))}
      </div>

      <CreateGroupModal
        open={open}
        onClose={() => setOpen(false)}
        selectedUserIds={[]}
      />
    </div>
  );
}
