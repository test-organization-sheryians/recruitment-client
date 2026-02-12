      


import { useEffect, useState } from "react";
import { useUpdateGroup } from "../hooks/useGroups";

interface RenameGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
  currentName: string;
}

export default function RenameGroupModal({
  open,
  onClose,
  groupId,
  currentName,
}: RenameGroupModalProps) {
  const [name, setName] = useState(currentName);

  // 👇 important: sync name when modal opens or currentName changes
  useEffect(() => {
    if (open) {
      setName(currentName);
    }
  }, [currentName, open]);

  const updateGroup = useUpdateGroup(groupId);

  if (!open) return null;

  const submit = () => {
    if (!name.trim()) return;

    updateGroup.mutate(
      { groupName: name },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="font-semibold text-lg mb-4">Rename Group</h2>

        <input
          className="border w-full px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter group name"
        />

        <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border"
            disabled={updateGroup.isPending}
          >
            Cancel
          </button>

          <button
            onClick={submit}
            disabled={updateGroup.isPending || !name.trim()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {updateGroup.isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
