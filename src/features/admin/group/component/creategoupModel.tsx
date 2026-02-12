


"use client";

import { useState } from "react";
import { useCreateGroup } from "../hooks/useGroups";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedUserIds: string[];
}

export default function CreateGroupModal({
  open,
  onClose,
  selectedUserIds,
}: Props) {
  const [groupName, setGroupName] = useState("");
  const createGroup = useCreateGroup();

  if (!open) return null;

  const submit = () => {
    createGroup.mutate({
      groupName,
      users: selectedUserIds,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-96 p-6 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">Create Group</h2>

        <input
          className="border w-full px-3 py-2 rounded"
          placeholder="Group name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
