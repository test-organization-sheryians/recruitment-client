"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import CreateJob from "@/features/admin/jobs/components/CreateJob";
// import ReusableDrawer from "./ReusableDrawer";
import SwipeableDrawer from "./SwipeableDrawer";

interface Props {
  onJobCreated: () => void;
}

export default function CreateJobButton({ onJobCreated }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-3">
      {/* BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white shadow-md transition-colors cursor-pointer"
      >
        <PlusIcon className="h-5 w-5" />
        <span>Create New Job</span>
      </button>

      {/* REUSABLE DRAWER */}
      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        width={520}
      >
        <div className="flex h-full w-[520px] flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              Create Job
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-800"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            <CreateJob
              onJobCreated={() => {
                onJobCreated();
                setOpen(false);
              }}
            />
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
}
