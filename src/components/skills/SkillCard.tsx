"use client";

import { useState } from "react";
import { ImBin } from "react-icons/im";
import { FiEdit, FiSave, FiX } from "react-icons/fi";

export default function SkillCard({ skill, onDelete, onUpdate }) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(skill.name);

  const handleCancel = () => {
    setName(skill.name);
    setEdit(false);
  };

  const handleUpdate = () => {
    if (!name.trim()) return;
    onUpdate({ id: skill._id, name: name.trim() });
    setEdit(false);
  };

  return (
  <div
    className="
      p-3 
      bg-white 
      border 
      border-[#BBCFFF]/50 
      rounded-lg 
      shadow-sm 
      transition duration-150 
      hover:shadow-md 
      space-y-3
    "
  >
  
    <div className="flex justify-between items-center">
      {edit ? (
        <input
          type="text"
          value={name}
          className="
            flex-grow 
            mr-2 
            px-3 
            py-1 
            text-gray-800 
            border 
            border-[#3668FF] 
            rounded-md 
            shadow-inner 
            focus:outline-none 
            focus:ring-2 
            focus:ring-[#3668FF]/50
            transition duration-150
          "
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        <p className="font-semibold text-gray-700 truncate">{skill.name}</p>
      )}

      {!edit && (
        <div className="flex gap-1.5">
          <button
            className="p-1 text-[#3668FF] rounded-md hover:bg-[#3668FF]/10 transition"
            onClick={() => setEdit(true)}
          >
            <FiEdit size={18} />
          </button>

          <button
            className="p-1 text-red-500 rounded-md hover:bg-red-500/10 transition"
            onClick={() => onDelete({ id: skill._id })}
          >
            <ImBin size={18} />
          </button>
        </div>
      )}
    </div>


    {edit && (
      <div className="flex justify-end gap-3 pt-2 border-t border-gray-200">
        <button
          className="px-3 py-1.5 text-white bg-[#3668FF] rounded-md hover:bg-[#254BAA] transition flex items-center gap-1"
          onClick={handleUpdate}
        >
          <FiSave size={18} /> Save
        </button>

        <button
          className="px-3 py-1.5 text-white bg-gray-400 rounded-md hover:bg-gray-500 transition flex items-center gap-1"
          onClick={handleCancel}
        >
          <FiX size={18} /> Cancel
        </button>
      </div>
    )}
  </div>
);
}
