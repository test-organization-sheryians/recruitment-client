"use client";
import { useState } from "react";

export default function SkillForm({ onSubmit }) {
  const [name, setName] = useState("");

  const handleAdd = (e: any) => {
    e.preventDefault();

    if (!name.trim()) return;

    onSubmit({ name });
    setName("");
  };

  return (
    <form onSubmit={handleAdd} className="flex-col sm:flex-row gap-3">
      <input
        type="text"
        className="
          flex-grow 
          w-full 
          px-4 
          py-2 
          text-gray-800 
          border 
          border-[#BBCFFF] 
          rounded-lg 
          shadow-sm
          focus:outline-none 
          focus:ring-2 
          focus:ring-[#3668FF] 
          focus:border-transparent 
          transition duration-150
        "
        placeholder="Enter new skill name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button 
        type="submit" 
        className="
          w-full sm:w-auto 
          bg-[#3668FF] 
          text-white 
          font-semibold 
          px-5 
          py-2 
          mt-[10px]
          rounded-lg 
          shadow-md 
          hover:bg-[#254BAA] 
          transition duration-200 
          ease-in-out
        "
      >
        + Add Skill
      </button>
    </form>
  );
}