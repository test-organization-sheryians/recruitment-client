"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, EllipsisVertical, Search } from "lucide-react";

import {
  useGetAllTests,
} from "@/features/admin/test/hooks/useTest";

import EnrolledPopup from "@/app/admin/tests/Enrolled/[id]/page";
import TestDetails from "./TestDetails";
import CreateTestModal from "./CreateTestForm";

/* ---------- TYPES ---------- */
interface Test {
  _id: string;
  title: string;
  category: string;
  duration: number;
  passingScore: number;
  showResults: boolean;
  skills?: string[];
}

export default function TestList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [showEnrollPopup, setShowEnrollPopup] = useState(false);
  const [editTestId, setEditTestId] = useState<string | null>(null);
  const [showDetailsId, setShowDetailsId] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetAllTests();

  const tests: Test[] = useMemo(
    () => (Array.isArray(data) ? data : []),
    [data]
  );

  const filteredTests = useMemo(() => {
    if (!searchTerm) return tests;
    const q = searchTerm.toLowerCase();

    return tests.filter(
      (test) =>
        test.title.toLowerCase().includes(q) ||
        test.category.toLowerCase().includes(q) ||
        test.skills?.some((s) => s.toLowerCase().includes(q))
    );
  }, [tests, searchTerm]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        Failed to load tests
      </div>
    );
  }

  const handleDiscloseResult = (test: Test) => { 
    alert(`Results for "${test.title}" have been disclosed to candidates.`);
    setOpenMenu(null);
  };

  return (
    <div className="min-h-screen bg-white relative">
      {openMenu && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setOpenMenu(null)}
        />
      )}

      {/* SEARCH */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* CARDS */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-10">
        {filteredTests.map((test) => (
          <div
            key={test._id}
            className="border rounded-xl p-6 shadow-lg bg-white relative"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h2 className="text-xl font-bold">{test.title}</h2>
                <p className="text-xs text-blue-600">
                  {test.category} Assessment
                </p>
              </div>

              <div className="relative z-20">
                <Button
                  className="p-2 bg-transparent text-black rounded-full hover:bg-gray-100"
                  onClick={() =>
                    setOpenMenu(openMenu === test._id ? null : test._id)
                  }
                >
                  <EllipsisVertical />
                </Button>

                {openMenu === test._id && (
                  <div
                    className="absolute right-[-10vw] top-10 w-44 bg-white border shadow-lg rounded-md z-30"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="w-full px-4 py-2 text-left"
                      onClick={() => {
                        setSelectedTestId(test._id);
                        setShowEnrollPopup(true);
                        setOpenMenu(null);
                      }}
                    >
                      Enrolled
                    </button>

                    <button
                      className="w-full px-4 py-2 text-left"
                      onClick={() => {
                        setEditTestId(test._id);
                        setOpenMenu(null);
                      }}
                    >
                      Edit Test
                    </button>

                    {!test.showResults && (
                      <button
                        className="w-full px-4 py-2 text-left"
                        onClick={() => handleDiscloseResult(test)}
                      >
                        Disclose Result
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex gap-2">
                <GraduationCap /> {test.category}
              </div>
              <div className="flex gap-2">
                <Clock /> {test.duration} minutes
              </div>
            </div>

            <div className="border-t mt-4 pt-3 flex justify-between">
              <span>Min Score: {test.passingScore}%</span>
              <Button
                variant="outline"
                onClick={() => setShowDetailsId(test._id)}
                className="bg-blue-700/80 text-white hover:bg-blue-800 hover:text-white"
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showEnrollPopup && selectedTestId && (
        <EnrolledPopup
          testId={selectedTestId}
          onClose={() => setShowEnrollPopup(false)}
        />
      )}

      {editTestId && (
        <CreateTestModal
          open
          testId={editTestId}
          onClose={() => setEditTestId(null)}
        />
      )}

      {showDetailsId && (
        <TestDetails
          testId={showDetailsId}
          onClose={() => setShowDetailsId(null)}
        />
      )}
    </div>
  );
}