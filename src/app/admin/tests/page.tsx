"use client";
import React, { useState } from "react";
import TestList from "@/features/admin/test/components/TestList";
import CreateTestModal from "@/features/admin/test/components/CreateTestModal";
import { Button } from "@/components/ui/button";

export default function TestsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-0 min-h-screen bg-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Tests</h1>
        <Button className="bg-white border border-blue-600 hover:bg-white  text-blue-600 hover:text-black" onClick={() => setOpen(true)}>+ Create Test</Button>
      </div>

      <TestList />

      <CreateTestModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}