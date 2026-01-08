"use client";

import { ArrowLeft } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction: () => void;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="fixed inset-x-0 inset-y-16 bg-gray-50">
     <div className="flex h-full items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg">
          <div className="mb-3 text-4xl">⚠️</div>

          <h2 className="mb-2 text-lg font-extrabold text-gray-800">
            {title}
          </h2>

          <p className="mb-6 text-sm text-gray-600">
            {description}
          </p>

          <button
            onClick={onAction}
            className="inline-flex items-center gap-2 cursor-pointer rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <ArrowLeft size={16} />
            {actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
