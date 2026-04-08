"use client";

import { AlertTriangle, X, Loader2 } from "lucide-react";
import { useState } from "react";

export default function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  isLoading = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  title: string;
  isLoading?: boolean;
}) {
  const [deleting, setDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirmClick = async () => {
    setDeleting(true);
    try {
      await onConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header with Icon */}
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 px-6 py-6 flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900">
              Delete Blog Post
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              This action cannot be undone
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={deleting || isLoading}
            className="flex-shrink-0 text-slate-400 hover:text-slate-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          <p className="text-slate-700 leading-relaxed">
            You're about to delete{" "}
            <span className="font-semibold text-red-600">"{title}"</span>. Once
            deleted, it cannot be recovered.
          </p>

          {/* Warning Box */}
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ This will permanently remove this blog post from the system.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={deleting || isLoading}
            className="px-5 py-2.5 rounded-lg font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirmClick}
            disabled={deleting || isLoading}
            className="px-5 py-2.5 rounded-lg font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 min-w-fit"
          >
            {deleting || isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4" />
                <span>Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
