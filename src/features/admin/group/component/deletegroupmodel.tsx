 

"use client";

import { useDeleteGroup } from "../hooks/useGroups";

interface Props {
  open: boolean;
  onClose: () => void;
  groupId: string;
}

export default function DeleteGroupModal({
  open,
  onClose,
  groupId,
}: Props) {
  const deleteGroup = useDeleteGroup();

  if (!open) return null;

  const confirm = () => {
    deleteGroup.mutate(groupId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96 shadow">
        <h2 className="font-semibold text-red-600 mb-4">
          Delete this group?
        </h2>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={confirm}
            disabled={deleteGroup.isPending}
            className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
