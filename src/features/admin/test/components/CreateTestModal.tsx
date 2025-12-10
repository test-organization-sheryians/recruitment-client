import React from "react";
import CreateTestForm from "./CreateTestForm";
import { X, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CreateTestModal({
  open,
  onClose,
  testId,
}: {
  open: boolean;
  onClose: () => void;
  testId?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-7xl p-6 rounded-2xl shadow-2xl animate-scaleIn border border-gray-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2">
            <FilePlus className="w-6 h-6 text-blue-700" />
            <h2 className="text-2xl font-bold text-gray-800">
              {testId ? "Update Test" : "Create New Test"}
            </h2>
          </div>

          <Button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-200 transition"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Form */}
        <CreateTestForm onClose={onClose} testId={testId} />
      </div>
    </div>
  );
}
