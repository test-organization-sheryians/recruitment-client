"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Clock, GraduationCap, EllipsisVertical, Search } from "lucide-react";

import { useGetAllTests } from "@/features/admin/test/hooks/useTest";
import EnrolledPopup from "@/app/admin/tests/Enrolled/[id]/page";
import CreateTestForm from "./CreateTestForm";

export default function TestList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // POPUP STATES
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [editTestId, setEditTestId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAllTests();

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".dropdown-area")) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const tests = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filteredTests = useMemo(() => {
    if (!searchTerm) return tests;
    const t = searchTerm.toLowerCase();

    return tests.filter(
      (test: any) =>
        test.title.toLowerCase().includes(t) ||
        test.category.toLowerCase().includes(t) ||
        test.skills?.some((s: string) => s.toLowerCase().includes(t))
    );
  }, [tests, searchTerm]);

  if (isLoading)
    return <div className="min-h-screen flex justify-center items-center text-xl">Loading...</div>;

  if (isError)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl text-red-600">
        Failed to load tests
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tests..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Test Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-10">
        {filteredTests.map((test: any) => (
          <div key={test._id} className="border rounded-xl p-6 shadow-lg bg-white relative">
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold">{test.title}</h2>
                <p className="text-xs text-blue-600">{test.category} Assessment</p>
              </div>

              {/* Dropdown Menu */}
              <div className="relative dropdown-area">
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setOpenMenu(openMenu === test._id ? null : test._id)}
                >
                  <EllipsisVertical />
                </button>

                {openMenu === test._id && (
                  <div className="absolute right-[-150px] top-10 w-40 bg-white border shadow-lg rounded-md z-50 dropdown-area">

                    {/* ENROLLED POPUP BUTTON */}
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setSelectedTestId(test._id);
                        setShowEnrollPopup(true);
                        setOpenMenu(null);
                      }}
                    >
                      Enrolled
                    </button>

                    {/* EDIT TEST POPUP */}
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setEditTestId(test._id);
                        setOpenMenu(null);
                      }}
                    >
                      Edit Test
                    </button>

                    {/* VIEW DETAILS */}
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        router.push(`/admin/tests/${test._id}`);
                        setOpenMenu(null);
                      }}
                    >
                      View Details
                    </button>

                    {/* DELETE */}
                    <button className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600">
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-2 text-gray-700 mb-4">
              <div className="flex items-center gap-3">
                <GraduationCap size={20} /> {test.category}
              </div>
              <div className="flex items-center gap-3">
                <Clock size={20} /> {test.duration} minutes
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-3 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Min Score: <span className="font-bold text-green-600">{test.passingScore}%</span>
              </p>

              <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={() => router.push(`/admin/tests/${test._id}`)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* =============== ENROLLED POPUP =============== */}
      {showEnrollPopup && selectedTestId && (
        <EnrolledPopup testId={selectedTestId} onClose={() => setShowEnrollPopup(false)} />
      )}

      {/* =============== EDIT TEST POPUP =============== */}
      {editTestId && (
        <CreateTestForm
          testId={editTestId}
          onClose={() => setEditTestId(null)}
        />
      )}
    </div>
  );
}
