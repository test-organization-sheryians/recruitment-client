"use client";

import { useState , useEffect } from "react";
import { Department } from "../Types/department.types";

interface Props {
  department: Department;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    id: string;
    name: string;
    description?: string;
  }) => Promise<void>;
}

export default function EditDepartmentModal({
  department,
  isOpen,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState(department.name);
  const [description, setDescription] = useState(
    department.description || ""
  );
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) return;

    setLoading(true);
    await onSave({
      id: department._id,
      name,
      description,
    });
    setLoading(false);
    onClose();
  };

   useEffect(() => {
  setName(department.name);
  setDescription(department.description || "");
}, [department]);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-lg font-semibold">Edit Department</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium">Department Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}