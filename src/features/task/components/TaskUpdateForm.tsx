
"use client";

import { useState } from "react";

interface TaskUpdateFormProps {
  initialTitle: string;
  initialStatus: "pending" | "in-progress" | "completed";
  isSubmitting?: boolean;
  onSubmit: (data: {
    title: string;
    status: "pending" | "in-progress" | "completed";
  }) => void;
  onCancel: () => void;
}

export default function TaskUpdateForm({
  initialTitle,
  initialStatus,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: TaskUpdateFormProps) {
  const [title, setTitle] = useState(initialTitle);
  const [status, setStatus] = useState(initialStatus);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title: title.trim(),
      status,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="px-3 py-2 border rounded-lg"
        disabled={isSubmitting}
      />

      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as typeof status)
        }
        className="px-3 py-2 border rounded-lg"
        disabled={isSubmitting}
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Update
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
