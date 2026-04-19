"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    setName(skill.name);
  }, [skill.name]);

  const handleEditClick = () => {
    setName(skill.name);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setName(skill.name);
    setIsModalOpen(false);
  };

  const handleUpdate = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onUpdate({ id: skill._id, name: trimmed });
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 flex-1 truncate text-sm font-medium text-gray-800 sm:text-base">
            {skill.name}
          </h3>

          <div className="flex flex-shrink-0 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[#3668FF] transition hover:bg-[#3668FF]/10 active:scale-95"
              onClick={handleEditClick}
              aria-label={`Edit ${skill.name}`}
            >
              <FiEdit size={16} />
            </button>

            <button
              type="button"
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-red-500 transition hover:bg-red-500/10 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => onDelete(skill._id)}
              aria-label={`Delete ${skill.name}`}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <span className="text-[10px] font-semibold">...</span>
              ) : (
                <ImBin size={14} />
              )}
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
          <div className="space-y-5">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleUpdate()}
              className="w-full rounded-xl border border-[#3668FF] px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-[#3668FF]/50"
              autoFocus
            />

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={handleCancel}
                className="w-full rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-200 sm:w-auto"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleUpdate}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#3668FF] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#254BAA] sm:w-auto"
              >
                <FiSave size={18} /> Save
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
