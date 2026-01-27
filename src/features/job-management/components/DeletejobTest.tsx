'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteJob } from '@/api/index';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle, Trash2, X } from "lucide-react";

interface DeleteJobProps {
  jobId: string;
  jobTitle?: string;
  onJobDeleted?: () => void;
}

export default function DeleteJob({
  jobId,
  jobTitle,
  onJobDeleted,
}: DeleteJobProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");

  const handleDelete = async () => {
    if (!jobId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await deleteJob(jobId);
      if (response) {
        setIsOpen(false);
        onJobDeleted?.();
        router.push('/admin/jobs');
        router.refresh();
      } else {
        setError(response?.message || 'Failed to delete job');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while deleting the job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger */}
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
          aria-label="Delete Job"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </DialogTrigger>

      <DialogContent
        className="max-w-[500px] p-0 overflow-hidden rounded-2xl"
        aria-describedby="delete-job-description"
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start gap-4">
            <div className="size-12 rounded-full bg-red-50 flex items-center justify-center text-red-600">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="flex-1">
              <DialogTitle className="text-xl font-bold">
                Delete {jobTitle || "Job"}?
              </DialogTitle>
              <p
                id="delete-job-description"
                className="text-sm text-gray-500 mt-1"
              >
                This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Body */}
        <div className="px-6">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg bg-red-100 text-red-700 px-4 py-3 text-sm"
            >
              {error}
            </div>
          )}

          <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700">
              You are about to permanently delete this job listing. This will also remove:
            </p>
            <ul className="mt-3 space-y-2">
              <li className="text-sm font-semibold text-red-600">
                • All applicant records
              </li>
              <li className="text-sm font-semibold text-red-600">
                • All screening questions
              </li>
            </ul>
          </div>

          <label className="block text-sm font-bold mb-2">
            To confirm, type <span className="text-red-600">DELETE</span>
          </label>
          <input
            autoFocus
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 mt-6 bg-gray-50">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            disabled={loading}
            className="flex-1 h-11 rounded-lg border font-bold text-sm hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || confirmText !== "DELETE"}
            className="flex-[1.5] h-11 rounded-lg bg-red-600 text-white font-bold text-sm hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {loading ? "Deleting..." : "Delete Permanently"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
