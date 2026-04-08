"use client";

import { useState, ReactNode } from "react";
import { PlusIcon } from "lucide-react";
import SwipeableDrawer from "./SwipeableDrawer";
import CreateJob from "../components/CreateJob";

interface Props {
  onJobCreated: () => void;
  // 🔥 This line below fixes the "Property 'children' does not exist" error
  children?: ReactNode; 
}

export default function CreateJobButton({ onJobCreated, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-row items-center gap-3">
      {/* 1. BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-700 px-6 text-sm font-bold text-white shadow-md transition-colors cursor-pointer hover:bg-blue-800"
      >
        <PlusIcon className="h-5 w-5" />
        <span className="whitespace-nowrap">Create New Job</span>
      </button>

      {/* 2. INJECTED FILTERS (All Jobs & Active) */}
      {children && (
        <div className="flex flex-row items-center gap-2 overflow-x-auto no-scrollbar">
          {children}
        </div>
      )}

      {/* REUSABLE DRAWER */}
      <SwipeableDrawer
        anchor="right"
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
      >
        <div className="flex h-full w-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b px-8 py-4">
            <h2 className="text-lg font-bold text-gray-900">
              Create Job
            </h2>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6">
            <CreateJob onClose={() => setOpen(false)} />
          </div>
        </div>
      </SwipeableDrawer>
    </div>
  );
}