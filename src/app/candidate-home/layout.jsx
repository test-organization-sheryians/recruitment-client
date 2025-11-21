"use client";

import Navbar from "@/components/Candidate/Navbar";
import Sidebar from "@/components/Candidate/Sidebar";

export default function CandidateLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* NAVBAR */}
      <div className="w-full bg-white border-b shadow-sm flex-shrink-0">
        <Navbar />
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
