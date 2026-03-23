"use client";

import { useState } from "react";
import { FiPlus, FiLoader } from "react-icons/fi";

interface CategoryFormProps {
  onSubmit: (data: { name: string }) => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export default function CategoryForm({
  onSubmit,
  isSubmitting = false,
  submitText = "Add Category",
}: CategoryFormProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    onSubmit({ name: trimmed });
    setName("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="
        w-full max-w-xl mx-auto
        bg-white border rounded-xl shadow-sm
        p-6 flex flex-col gap-5
      "
    >
      <h2 className="text-xl font-semibold text-gray-800">
        Create Category
      </h2>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. IT, Marketing, Finance"
        disabled={isSubmitting}
        className="
          w-full border rounded-lg px-4 py-3
          focus:outline-none focus:ring-2 focus:ring-blue-500
        "
      />

      <button
        type="submit"
        disabled={isSubmitting || !name.trim()}
        className="
          w-full bg-blue-600 text-white py-3 rounded-lg
          flex items-center justify-center gap-2
          hover:bg-blue-700 transition
          disabled:opacity-60
        "
      >
        {isSubmitting ? (
          <>
            <FiLoader className="animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <FiPlus />
            {submitText}
          </>
        )}
      </button>
    </form>
  );
}
