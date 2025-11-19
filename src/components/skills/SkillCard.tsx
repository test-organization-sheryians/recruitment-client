// components/SkillCard.jsx
"use client";
import { useState } from "react";
import { ImBin } from "react-icons/im"; 
import { FiEdit, FiSave, FiX } from "react-icons/fi";

export default function SkillCard({ skill, onDelete, onUpdate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState(skill.name);

  // --- Modal Handlers ---

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
      {/* --- Skill Card Display: Reduced Padding for Compactness --- */}
      <div
        className="
          p-3 // Reduced padding from p-4 to p-3
          bg-white 
          rounded-xl 
          shadow-md 
          transition duration-200 
          hover:shadow-lg
          border border-gray-100
        "
      >
        <div className="flex justify-between items-center"> {/* Changed items-start to items-center */}
          
          {/* Skill Name */}
          <h3 className="text-base font-semibold text-gray-800 truncate"> {/* Adjusted text size */}
            {skill.name}
          </h3>
          
          {/* Action Buttons (Edit and Delete) */}
          <div className="flex gap-1.5 ml-2 flex-shrink-0">
            <button
              className="p-0.5 text-[#3668FF] rounded-full hover:bg-[#3668FF]/10 transition" // Reduced button padding
              onClick={handleEditClick}
              aria-label={`Edit ${skill.name}`}
            >
              <FiEdit size={14} /> {/* Reduced icon size */}
            </button>
            <button
              className="p-0.5 text-red-500 rounded-full hover:bg-red-500/10 transition" // Reduced button padding
              onClick={() => onDelete({ id: skill._id })}
              aria-label={`Delete ${skill.name}`}
            >
              <ImBin size={14} /> {/* Reduced icon size */}
            </button>
          </div>
        </div>

        {/* Removed all placeholder divs to keep the card minimal for the grid */}
        
      </div>

      {/* --- Edit Modal (The Pop-up on edit click) --- */}
      {isModalOpen && (
        <div
          className="
            fixed inset-0 
            bg-black/40 backdrop-blur-sm 
            flex justify-center items-center 
            z-50 
            p-4
          "
          onClick={handleCancel}
        >
          <div
            className="
              bg-white 
              p-6 
              rounded-xl 
              shadow-2xl 
              max-w-md w-full 
            "
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">
              Edit Skill: {skill.name}
            </h3>
            <div className="mb-4">
              <input
                type="text"
                value={name}
                className="w-full px-3 py-2 text-gray-800 border border-[#3668FF] rounded-md focus:outline-none focus:ring-2 focus:ring-[#3668FF]/50"
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleUpdate(); }}
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                className="px-3 py-1.5 text-white bg-gray-400 rounded-md hover:bg-gray-500 transition flex items-center gap-1"
                onClick={handleCancel}
              >
                <FiX size={18} /> Cancel
              </button>
              <button
                className="px-3 py-1.5 text-white bg-[#3668FF] rounded-md hover:bg-[#254BAA] transition flex items-center gap-1"
                onClick={handleUpdate}
              >
                <FiSave size={18} /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}