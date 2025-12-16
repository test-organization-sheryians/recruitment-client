"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, EllipsisVertical, Search } from "lucide-react";

import { useGetAllTests, useUpdateTest } from "@/features/admin/test/hooks/useTest";
import EnrolledPopup from "@/app/admin/tests/Enrolled/[id]/page";
import CreateTestForm from "./CreateTestForm";
import TestDetails from "./TestDetails";

// Define TypeScript interfaces
interface Test {
  _id: string;
  title: string;
  category: string;
  duration: number;
  passingScore: number;
  showResults: boolean;
  skills?: string[];
}

interface EnrolledPopupProps {
  testId: string;
  onClose: () => void;
}

export default function TestList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [editTestId, setEditTestId] = useState<string | null>(null);
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { data, isLoading, isError } = useGetAllTests();
  const { mutate: updateTest } = useUpdateTest();

  const tests = useMemo(() => (Array.isArray(data) ? data : []), [data]);

  const filteredTests = useMemo(() => {
    if (!searchTerm) return tests;
    const q = searchTerm.toLowerCase();

    return tests.filter(
      (test: Test) =>
        test.title.toLowerCase().includes(q) ||
        test.category.toLowerCase().includes(q) ||
        test.skills?.some((s: string) => s.toLowerCase().includes(q))
    );
  }, [tests, searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu && !dropdownRefs.current[openMenu]?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openMenu]);

  if (isLoading)
    return <div className="min-h-screen flex justify-center items-center text-xl">Loading...</div>;

  if (isError)
    return (
      <div className="min-h-screen flex justify-center items-center text-xl text-red-600">
        Failed to load tests
      </div>
    );

  const handleDiscloseResult = (id: string) => {
    updateTest({ id, showResults: true });
    setOpenMenu(null);
  };

  const handleDeleteTest = (id: string) => {
    // Implement delete functionality here
    console.log("Delete test:", id);
    setOpenMenu(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SEARCH - No changes */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search tests..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CARDS - Fixed accessibility issues */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-10">
        {filteredTests.map((test: Test) => (
          <div
            key={test._id}
            className="border rounded-xl p-6 shadow-lg bg-white relative"
            onClick={() => openMenu && openMenu !== test._id && setOpenMenu(null)}
          >
            {/* HEADER */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold">{test.title}</h2>
                <p className="text-xs text-blue-600">{test.category} Assessment</p>
              </div>

              {/* MENU - Fixed ARIA and ref issues */}
              <div 
                className="relative dropdown-area"
                ref={(el: HTMLDivElement | null) => {
                  dropdownRefs.current[test._id] = el;
                }}
              >
                <Button
                  className="p-2 bg-white text-black hover:bg-gray-100 rounded-full"
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setOpenMenu(openMenu === test._id ? null : test._id);
                  }}
                  aria-label={`Options for ${test.title}`}
                  aria-expanded={openMenu === test._id}
                  aria-haspopup="true"
                >
                  <EllipsisVertical />
                </Button>

                {openMenu === test._id && (
                  <div
                    className="absolute right-[-150px] top-10 w-40 bg-white border shadow-lg rounded-md z-50"
                    onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  >
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

                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => {
                        setEditTestId(test._id);
                        setOpenMenu(null);
                      }}
                    >
                      Edit Test
                    </button>

                    {!test.showResults && (
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-gray-100"
                        onClick={() => handleDiscloseResult(test._id)}
                      >
                        Disclose Result
                      </button>
                    )}

                    <button 
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600"
                      onClick={() => handleDeleteTest(test._id)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* INFO */}
            <div className="space-y-2 text-gray-700 mb-4">
              <div className="flex items-center gap-3">
                <GraduationCap size={20} /> {test.category}
              </div>

              <div className="flex items-center gap-3">
                <Clock size={20} /> {test.duration} minutes
              </div>
            </div>

            {/* FOOTER */}
            <div className="border-t pt-3 flex justify-between items-center">
              <p className="text-sm text-gray-700">
                Min Score: <span className="font-bold text-green-600">{test.passingScore}%</span>
              </p>

              <Button
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                onClick={() => setShowDetailsId(test._id)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* ENROLLED POPUP */}
      {showEnrollPopup && selectedTestId && (
        <EnrolledPopup
          testId={selectedTestId}
          onClose={() => setShowEnrollPopup(false)}
        />
      )}

      {/* EDIT POPUP */}
      {editTestId && (
        <CreateTestForm
          testId={editTestId}
          onClose={() => setEditTestId(null)}
        />
      )}

      {/* INLINE TEST DETAILS */}
      {showDetailsId && (
        <div className="max-w-7xl mx-auto px-4 pb-10">
          <TestDetails testId={showDetailsId} onClose={() => setShowDetailsId(null)} />
        </div>
      )}
    </div>
  );
}