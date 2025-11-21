"use client";
import { useState } from "react";
import { FiEdit, FiTrash2, FiSave } from "react-icons/fi";
import Modal from "../../../../components/ui/Modal";
import { JobCategory } from "../../../../types/JobCategeory";

export default function CategoryCard({
    category,
    onDelete,
    onUpdate,
    isDeleting,
}: {
    category: JobCategory;
    onDelete: (id: string) => void;
    onUpdate: (data: { id: string; name: string }) => void;
    isDeleting: boolean;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [name, setName] = useState(category.name);

    const handleEditClick = () => {
        setName(category.name);
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setName(category.name);
        setIsModalOpen(false);
    };

    const handleUpdate = () => {
        if (!name.trim()) return;
        onUpdate({ id: category._id, name: name.trim() });
        setIsModalOpen(false);
    };

    return (
        <>
            <div
                className="
          flex items-center justify-between 
          bg-gray-50 
          border 
          rounded-md 
          p-3 
          hover:shadow-sm 
          transition-shadow
        "
            >
                <div className="text-sm font-medium">{category.name}</div>
                <div className="flex items-center gap-2">
                    <button
                        title={`Edit ${category.name}`}
                        aria-label={`Edit ${category.name}`}
                        className="p-1 rounded text-gray-600 hover:text-blue-600 transition-colors"
                        onClick={handleEditClick}
                    >
                        <FiEdit className="w-4 h-4" />
                    </button>

                    <button
                        title={`Delete ${category.name}`}
                        aria-label={`Delete ${category.name}`}
                        className="p-1 rounded text-gray-600 hover:text-red-600 transition-colors"
                        onClick={() => onDelete(category._id)}
                    >
                        {isDeleting ? "..." : <FiTrash2 className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            {isModalOpen && (
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
                        onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
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
                            className="px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center gap-2"
                        >
                            <FiSave size={18} /> Save
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
