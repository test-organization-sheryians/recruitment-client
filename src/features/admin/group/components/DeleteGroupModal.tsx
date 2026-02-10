import { useDeleteGroup } from "../hooks/useGroups";

export default function DeleteGroupModal({
  open,
  onClose,
  groupId,
}: any) {
  const deleteGroup = useDeleteGroup();

  if (!open) return null;

  const confirm = () => {
    deleteGroup.mutate(groupId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded w-96">
        <h2 className="font-semibold text-red-600 mb-4">
          Delete this group?
        </h2>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button
            onClick={confirm}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
