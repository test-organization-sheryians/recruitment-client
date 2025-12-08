"use client";

import React from "react";
import EnrolledTestEmail from "@/features/admin/test/components/EnrolledTestEmail";
import { Button } from "@/components/ui/button";

export default function EnrolledPopup({
  testId,
  onClose,
}: {
  testId: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-40 z-[999] flex justify-center items-center">
      <div className="bg-white w-[80vw] h-[95vh] overflow-y-auto rounded-2xl shadow-xl p-8 relative">

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Manage Enrolled Emails</h2>

          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={onClose}
          >
            Close
          </Button>
        </div>

        {/* YOUR EMAIL COMPONENT */}
        <EnrolledTestEmail testId={testId} />
      </div>
    </div>
  );
}
