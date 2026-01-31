"use client";

import { useState } from "react";
import { FiPlus, FiLoader } from "react-icons/fi";

export interface TaskFormData {
  title: string;
  description?: string;
  status: "pending" | "in-progress" | "completed";
}

interface TaskFormProps {
  onSubmit: (data: TaskFormData) => void;
  isSubmitting?: boolean;
  submitText?: string;
}

export default function TaskForm({
  onSubmit,
  isSubmitting = false,
  submitText = "Add Task",
}: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskFormData["status"]>("pending");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onSubmit({
      title: trimmedTitle,
      description: description.trim() || undefined,
      status,
    });

    // reset form after submit
    setTitle("");
    setDescription("");
    setStatus("pending");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center">CREATE TASK</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        disabled={isSubmitting}
        className="px-4 py-3 border rounded-xl"
        required
      />

      {/* Description */}
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description (optional)"
        disabled={isSubmitting}
        className="px-4 py-3 border rounded-xl resize-none"
        rows={3}
      />

      {/* Status */}
      <select
        value={status}
        onChange={(e) =>
          setStatus(e.target.value as TaskFormData["status"])
        }
        disabled={isSubmitting}
        className="px-4 py-3 border rounded-xl bg-white"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || !title.trim()}
        className="py-3 bg-blue-600 text-white rounded-xl flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <FiLoader className="animate-spin" />
            Saving...
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
