"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import InroletextEmail from "@/features/admin/test/components/EnrolledTestEmail"; // path sahi karein

export default function InroleEditPage() {
  const { id } = useParams();
  const [emails, setEmails] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">
        Inrole Users for Test {id}
      </h1>

      <InroletextEmail
        initialEmails={emails}
        onChange={(updated) => setEmails(updated)}
      />
    </div>
  );
}
