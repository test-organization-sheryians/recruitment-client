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
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Groups & Members
          </h1>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Create Group
        </button>
      </div>

      <div className="space-y-5">
        {isLoading && <p>Loading...</p>}

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
