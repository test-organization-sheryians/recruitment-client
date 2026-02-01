"use client";

import { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiSave } from "react-icons/fi";
import Modal from "../../../../components/ui/Modal";
import { JobCategory } from "../../../../types/JobCategeory";

/* ===================== TYPES ===================== */

type CategoryCardProps = {
  category: JobCategory;
  onDelete: (id: string) => void;
  onUpdate: (data: { id: string; name: string }) => void;
  isDeleting: boolean;
};

/* ===================== COMPONENT ===================== */

export default function CategoryCard({
  category,
  onDelete,
  onUpdate,
  isDeleting,
}: CategoryCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(category.name);

  /* Sync local state if category changes */
  useEffect(() => {
    setName(category.name);
  }, [category.name]);

  const handleEditClick = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setName(category.name);
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    onUpdate({ id: category._id, name: trimmed });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="flex items-center justify-between bg-gray-50 border rounded-md p-3 hover:shadow-sm transition-shadow">
        <div className="text-sm font-medium">{category.name}</div>

        <div className="flex items-center gap-2">
          {/* Edit */}
          <button
            title={`Edit ${category.name}`}
            aria-label={`Edit ${category.name}`}
            className="p-0.5 text-[#3668FF] rounded-full hover:bg-[#3668FF]/10 transition"
            onClick={handleEditClick}
          >
            <FiEdit className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            title={`Delete ${category.name}`}
            aria-label={`Delete ${category.name}`}
            className="p-0.5 text-red-500 rounded-full hover:bg-red-500/10 transition disabled:opacity-50"
            onClick={() => onDelete(category._id)}
            disabled={isDeleting}
          >
            {isDeleting ? "..." : <FiTrash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="Edit Category"
        maxWidth="md"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && name.trim()) {
              handleUpdate();
            }
          }}
          className="w-full px-4 py-3 border border-blue-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600/50"
          autoFocus
        />

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-5 py-2.5 bg-gray-400 text-white rounded-xl hover:bg-gray-500 transition"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            disabled={!name.trim()}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
          >
            <FiSave size={18} /> Save
          </button>
        </div>
      </Modal>
    </>
  );
}
