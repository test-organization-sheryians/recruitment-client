// components/AddSkillButtonWithModal.jsx
"use client";
import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import SkillForm from "./SkillForm";

export default function AddSkillButtonWithModal({ onNewSkillSubmit }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFormSubmit = (skillData) => {
    onNewSkillSubmit(skillData);
    setIsModalOpen(false);
  };

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Button matching the style in the image */}
      <button
        onClick={handleOpenModal}
        className="
          bg-[#3668FF] 
          text-white 
          font-semibold 
          px-4 py-2 
          rounded-lg 
          shadow-md 
          hover:bg-[#254BAA] 
          transition duration-200
          flex items-center gap-1
        "
      >
        <FiPlus size={20} /> Add New Skill
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="
            fixed inset-0 
            bg-black/50 backdrop-blur-sm 
            flex justify-center items-center 
            z-[100] // High Z-index to ensure it is always on top
            p-4
          "
          onClick={handleCloseModal}
        >
          <div
            className="
              bg-white 
              p-6 
              rounded-xl 
              shadow-2xl 
              max-w-lg w-full 
              relative
            "
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Add New Skill
            </h3>
            <SkillForm onSubmit={handleFormSubmit} />
            <button
              onClick={handleCloseModal}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 transition"
              aria-label="Close"
            >
              <FiX size={24} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}