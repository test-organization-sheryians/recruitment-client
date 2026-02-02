"use client";

import { useState } from "react";

interface UpdateCategoryFormProps {
  initialName: string;
  onSubmit: (data: { name: string }) => void;
  isSubmitting?: boolean;
}

export default function UpdateCategoryForm({
  initialName,
  onSubmit,
  isSubmitting = false,
}: UpdateCategoryFormProps) {
  const [name, setName] = useState(initialName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSubmit({ name: name.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-2">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 px-3 py-2 border rounded-md"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="px-4 py-2 bg-green-600 text-white rounded-md"
      >
        {isSubmitting ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
