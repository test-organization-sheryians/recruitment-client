"use client";
import { useState } from "react";
import { ImBin } from "react-icons/im";
import { FiEdit, FiSave } from "react-icons/fi";
import Modal from "../../../../components/ui/Modal";

export default function SkillCard({
  skill,
  onDelete,
  onUpdate,
  isDeleting,
}: {
  skill: { _id: string; name: string };
  onDelete: (id: string) => void;
  onUpdate: (data: { id: string; name: string }) => void;
  isDeleting: boolean;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(skill.name);

  const handleEditClick = () => {
    setName(skill.name);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setName(skill.name);
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    if (!name.trim()) return;
    onUpdate({ id: skill._id, name: name.trim() });
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="
          p-3 
          bg-white 
          rounded-xl 
          shadow-md 
          transition duration-200 
          hover:shadow-lg
          border border-gray-100
        "
      >
        <div className="flex justify-between items-center">
          <h3 className="text-base text-gray-800 truncate">{skill.name}</h3>

          <div className="flex gap-1.5 ml-2 flex-shrink-0">
            <button
              className="p-0.5 text-[#3668FF] rounded-full hover:bg-[#3668FF]/10 transition"
              onClick={handleEditClick}
              aria-label={`Edit ${skill.name}`}
            >
              <FiEdit size={14} />
            </button>
            <button
              className="p-0.5 text-red-500 rounded-full hover:bg-red-500/10 transition cursor-pointer"
              onClick={() => onDelete(skill._id)}
              aria-label={`Delete ${skill.name}`}
            >
              {isDeleting ? "Deleting..." : <ImBin size={14} />}
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          title="Edit Skill"
          maxWidth="md"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
            className="w-full px-4 py-3 border border-[#3668FF] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3668FF]/50"
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
              className="px-5 py-2.5 bg-[#3668FF] text-white rounded-xl hover:bg-[#254BAA] transition flex items-center gap-2"
            >
              <FiSave size={18} /> Save
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}
