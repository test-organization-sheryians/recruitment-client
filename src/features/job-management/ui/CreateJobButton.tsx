"use client";

import { useState } from "react";
import { PlusIcon } from "lucide-react";
import CreateJob from "@/features/admin/jobs/components/CreateJob";
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
        className="flex h-10 items-center justify-center gap-2 rounded-lg  text-white px-6 text-sm font-bold shadow-md bg-blue-700 transition-colors"
      >
        <PlusIcon className="w-5 h-5" />
        <span>Create New Job</span>
      </button>

      {/* DRAWER */}
      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        sections={[
          {
            items: [
              {
                text: "",
                icon: (
                  <div className="w-[520px] flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b">
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
                ),
              },
            ],
          },
        ]}
      />
    </div>
  );
}
