"use client";

import { useState } from "react";
import { useGroups } from "@/features/admin/group/hooks/useGroups";
import CreateGroupModal from "@/features/admin/group/components/CreateGroupModal";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
  const { data, isLoading, isError } = useGroups();
  const [open, setOpen] = useState(false);
  const router = useRouter();
3
  const groups = data ?? [];

  if (isLoading) {
    return <div className="p-8">Loading groups...</div>;
  }

  if (isError) {
    return <div className="p-8 text-red-500">Failed to load groups</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Groups</h1>

        <button
          onClick={() => setOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Group
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-gray-500">No groups created yet</p>
      )}

      {groups.map((g: any) => (
        <div
          key={g._id}
          className="border p-4 rounded mb-2 cursor-pointer hover:bg-gray-50"
          onClick={() => router.push(`/groups/${g._id}`)}
        >
          <h3 className="font-semibold">{g.groupName}</h3>

          <p className="text-sm text-gray-500">
            {(g.users?.length ?? 0)} users
          </p>
        </div>
      ))}

      <CreateGroupModal
        open={open}
        onClose={() => setOpen(false)}
        selectedUserIds={[]}
      />
    </div>
  );
}
