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
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Skill Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. React, TypeScript, Leadership..."
          autoFocus
          disabled={isSubmitting}
          className="
            w-full rounded-xl border border-[#BBCFFF] px-4 py-3
            text-sm sm:text-base text-gray-800 shadow-sm
            focus:outline-none focus:ring-2 focus:ring-[#3668FF] focus:border-transparent
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-all duration-200
          "
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="
          flex w-full items-center justify-center gap-2
          rounded-xl bg-[#3668FF] px-4 py-3 text-sm sm:text-base font-semibold text-white shadow-lg
          hover:bg-[#254BAA] active:scale-[0.98]
          disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-[#3668FF]
          transition-all duration-200
          sm:w-fit
        "
      >
        {isSubmitting ? (
          <>
            <FiLoader className="animate-spin" size={18} />
            Adding...
          </>
        ) : (
          <>
            <FiPlus size={18} />
            {submitText}
          </>
        )}
      </button>
    </form>
  );
}
