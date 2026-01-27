"use client";
import { useState } from "react";

interface Props {
  onSubmit: (data: { name: string; description?: string }) => void;
}

export default function DepartmentForm({ onSubmit }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, description });
    setName("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        className="border p-2 w-full"
        placeholder="Department name"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

      <textarea
        className="border p-2 w-full"
        placeholder="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />

      <button className="bg-black text-white px-4 py-2 rounded">
        Add Department
      </button>
    </form>
  );
}