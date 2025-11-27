"use client";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: {
    name: string;
  };
}

interface DeleteModalProps {
  selectedUserForDelete: User | null;
  deletingUserId: string | null;
  confirmDelete: () => void;
  setSelectedUserForDelete: (user: User | null) => void;
}

export default function DeleteModal({
  selectedUserForDelete,
  deletingUserId,
  confirmDelete,
  setSelectedUserForDelete,
}: DeleteModalProps) {
  if (!selectedUserForDelete) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex justify-center items-center z-50"
      onClick={() => setSelectedUserForDelete(null)}
    >
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-72"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-3 text-center">
          Delete User?
        </h2>

        <p className="text-gray-600 text-sm text-center">
          Are you sure you want to delete{" "}
          <span className="font-semibold">
            {selectedUserForDelete.firstName} {selectedUserForDelete.lastName}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="mt-5 flex gap-3">
          <button
            onClick={confirmDelete}
            disabled={deletingUserId === selectedUserForDelete._id}
            className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {deletingUserId === selectedUserForDelete._id
              ? "Deleting..."
              : "Delete"}
          </button>

          <button
            onClick={() => setSelectedUserForDelete(null)}
            className="flex-1 py-2 bg-gray-200 rounded hover:bg-gray-300"
            disabled={deletingUserId === selectedUserForDelete._id}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}