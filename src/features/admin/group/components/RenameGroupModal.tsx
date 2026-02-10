import { useState } from "react";
import { useUpdateGroup } from "../hooks/useGroupDetails";

export default function RenameGroupModal({
  open,
  onClose,
  groupId,
  currentName,
}: any) {
  const [name, setName] = useState(currentName);
  const updateGroup = useUpdateGroup(groupId);

  if (!open) return null;

  const submit = () => {
    updateGroup.mutate({ groupName: name });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="font-semibold mb-3">Rename Group</h2>

        <input
          className="border w-full px-3 py-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={submit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
