"use client";

import { useState } from "react";
import { FiPlus, FiLoader } from "react-icons/fi";

interface SkillFormProps {
  onSubmit: (data: { name: string }) => void;
  isSubmitting?: boolean;        
  submitText?: string;           
}

export default function SkillForm({
  onSubmit,
  isSubmitting = false,
  submitText = "Add Skill",
}: SkillFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    onSubmit({ name: trimmed });
    setName(""); 
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. React, TypeScript, Leadership..."
        autoFocus
        disabled={isSubmitting}
        className="
          w-full px-4 py-3 text-gray-800 text-base
          border border-[#BBCFFF] rounded-xl shadow-sm
          focus:outline-none focus:ring-2 focus:ring-[#3668FF] focus:border-transparent
          disabled:bg-gray-100 disabled:cursor-not-allowed
          transition-all duration-200
        "
      />

      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="
          w-full py-3.5 bg-[#3668FF] text-white font-semibold rounded-xl shadow-lg
          hover:bg-[#254BAA] active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#3668FF]
          flex items-center justify-center gap-2
          transition-all duration-200
        "
      >
        {isSubmitting ? (
          <>
            <FiLoader className="animate-spin" size={20} />
            Adding...
          </>
        ) : (
          <>
            <FiPlus size={20} />
            {submitText}
          </>
        )}
      </button>
    </form>
  );
}