import React from "react";
import CreateTestForm from "./CreateTestForm";
import { X, FilePlus } from "lucide-react";

export default function CreateTestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-7xl p-6 rounded-2xl shadow-2xl animate-scaleIn border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <FilePlus className="w-6 h-6 text-blue-700" />
            <h2 className="text-2xl font-bold text-gray-800">Create New Test</h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <CreateTestForm onSuccess={onClose} />
      </div>
    </div>
  );
}
