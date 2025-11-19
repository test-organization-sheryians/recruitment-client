// components/SkillForm.jsx
"use client";
import { useState } from "react";
import { FiPlus } from "react-icons/fi";

export default function SkillForm({ onSubmit }) {
  const [name, setName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name });
    setName("");
  };

  return (
    // Changed layout from flex-row to flex-col for better vertical stacking in the small column
    <form onSubmit={handleAdd} className="flex flex-col gap-3"> 
      <input
        type="text"
        className="
          w-full 
          px-3 py-2 
          text-gray-800 
          border border-[#BBCFFF] 
          rounded-lg shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#3668FF] 
          focus:border-transparent transition duration-150
        "
        placeholder="Enter new skill" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoFocus
      />
      <button
        type="submit"
        className="
          w-full
          bg-[#3668FF] 
          text-white 
          font-semibold 
          px-5 py-2 
          rounded-lg shadow-md 
          hover:bg-[#254BAA] 
          transition duration-200 
          flex items-center justify-center gap-1
        "
      >
        <FiPlus size={18} /> Add Skill
      </button>
    </form>
  );
}