"use client";

import { useState } from "react";
import { useAddUser } from "../hooks/useGroups";

export default function AddUserModal({
  open,
  onClose,
  groupId,
}: any) {
  const [userId, setUserId] = useState("");
  const addUser = useAddUser(groupId);

  if (!open) return null;

  const submit = () => {
    addUser.mutate(userId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="mb-4 font-semibold">
          Add User to Group
        </h2>

        <input
          placeholder="Enter User ID"
          className="border w-full px-3 py-2 rounded"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
