'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface ConfirmDeleteDialogProps {
  triggerLabel?: string;
  title: string;
  description?: string;
  consequences?: string[];
  confirmText?: string;
  onDelete: () => Promise<boolean>; // ✅ IMPORTANT
  onDeleted?: () => void;
  redirectAfterDelete?: () => void;
}

export default function ConfirmDeleteDialog({
  triggerLabel = "Delete",
  title,
  description = "This action cannot be undone.",
  consequences = [],
  confirmText = "DELETE",
  onDelete,
  onDeleted,
  redirectAfterDelete,
}: ConfirmDeleteDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");

  const handleDelete = async () => {
    try {
      setLoading(true);
      setError(null);

      const success = await onDelete();

      if (!success) {
        setError("Failed to delete. Please try again.");
        return;
      }

      setIsOpen(false);
      onDeleted?.();
      redirectAfterDelete?.();
    } catch (err) {
      console.error(err);
      setError("An error occurred while deleting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="h-11 rounded-lg bg-red-50 text-red-800 font-semibold hover:bg-red-100 transition flex justify-center items-center gap-2 border border-red-200">
          <Trash2 className="w-4 h-4" />
          {triggerLabel}
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-[500px] p-0 rounded-2xl [&>button]:hidden">
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">
                {title}
              </DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                {description}
              </p>
            </div>

            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6">
          {error && (
            <div className="mb-4 rounded bg-red-100 text-red-700 px-4 py-2 text-sm">
              {error}
            </div>
          )}

          {consequences.length > 0 && (
            <div className="bg-red-50 border rounded p-4 mb-4">
              <p className="text-sm">This will also remove:</p>
              <ul className="mt-2">
                {consequences.map((c, i) => (
                  <li key={i} className="text-red-600 font-semibold">
                    • {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <label className="text-sm font-bold">
            Type <span className="text-red-600">{confirmText}</span> to confirm
          </label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="mt-2 w-full h-11 px-3 border rounded"
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 bg-gray-50 rounded-full">
          <button
            onClick={() => setIsOpen(false)}
            className="flex-1 h-11 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleDelete}
            disabled={loading || input !== confirmText}
            className="flex-[1.5] h-11 bg-red-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
