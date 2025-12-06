"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Clock,
  GraduationCap,
  EllipsisVertical,
  Search,
} from "lucide-react";

import { useGetAllTests } from "@/features/admin/test/hooks/useTest";

// --------------------------
// Types
// --------------------------
interface Test {
  _id: string;
  title: string;
  category: string;
  duration: number;
  passingScore: number;
  skills?: string[];
}

// --------------------------
// Search filter function
// --------------------------
const filterTests = (tests: Test[], searchTerm: string) => {
  if (!searchTerm) return tests;

  const lower = searchTerm.toLowerCase();

  return tests.filter(
    (test) =>
      test.title?.toLowerCase().includes(lower) ||
      test.category?.toLowerCase().includes(lower) ||
      test.skills?.some((skill: string) =>
        skill.toLowerCase().includes(lower)
      )
  );
};

export default function TestList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Fetch API
  const { data, isLoading, isError } = useGetAllTests();

  // Close dropdown when user clicks outside
  useEffect(() => {
    const handler = () => setOpenMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const tests: Test[] = useMemo(
    () => (Array.isArray(data) ? (data as Test[]) : []),
    [data]
  );

  const filteredTests = useMemo(
    () => filterTests(tests, searchTerm),
    [tests, searchTerm]
  );

  // Loading UI
  if (isLoading)
    return (
      <div className="min-h-screen flex justify-center items-center text-lg">
        Loading...
      </div>
    );

  if (isError)
    return (
      <div className="min-h-screen flex justify-center items-center text-red-500 text-lg">
        Failed to load tests
      </div>
    );

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative w-full">
          <Search size={20} className="absolute left-3 top-3 text-gray-400" />

          <input
            type="text"
            placeholder="Search tests..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      {/* Test Cards */}
      <div className="max-w-7xl mx-auto py-1 px-4 sm:px-6 lg:px-8">
        {filteredTests.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <Search size={32} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-xl font-medium">
              No tests found for {searchTerm || "your search"}
            </p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search query.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test: Test) => (
              <div
                key={test._id}
                className="relative bg-white border border-gray-100 rounded-xl p-6 flex flex-col shadow-lg hover:shadow-xl transition"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-0.5">
                  <div>
                    <h2 className="text-xl font-bold">{test.title}</h2>
                    <p className="text-blue-600 font-normal text-xs mt-0.5">
                      {test.category} Assessment
                    </p>
                  </div>

                  {/* 3 Dot Button */}
                  <div
                    className="relative w-fit ml-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="p-2 text-gray-400 hover:text-gray-800 rounded-full hover:bg-gray-100"
                      aria-label="More options"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenu(openMenu === test._id ? null : test._id);
                      }}
                    >
                      <EllipsisVertical size={20} />
                    </button>

                    {/* Dropdown */}
                    {openMenu === test._id && (
                      <div
                        className="
                          absolute 
                          top-8 
                          right-[20px]
                          translate-x-full
                          w-44 
                          bg-white 
                          shadow-lg 
                          rounded-lg 
                          border 
                          border-gray-200 
                          z-50
                        "
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            setOpenMenu(null);
                            router.push(`/admin/tests/Enrolled/${test._id}`);
                          }}
                        >
                          Enrolled
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                          onClick={() => {
                            setOpenMenu(null);
                            router.push(`/admin/tests/${test._id}`);
                          }}
                        >
                          View Details
                        </button>

                        <button
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                          onClick={() => {
                            setOpenMenu(null);
                            alert("Delete clicked");
                          }}
                        >
                          Delete Test
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Section */}
                <div className="space-y-2 my-6 text-gray-700">
                  <div className="flex items-center gap-3">
                    <GraduationCap size={20} className="text-gray-500" />
                    <span className="font-medium">Category:</span>
                    <span>{test.category}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Clock size={20} className="text-gray-500" />
                    <span className="font-medium">Duration:</span>
                    <span>{test.duration} minutes</span>
                  </div>
                </div>

                <div className="border-t my-1"></div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto pt-1">
                  <p className="text-sm text-gray-600">
                    Min. Score:{" "}
                    <span className="font-bold text-green-600">
                      {test.passingScore}%
                    </span>
                  </p>

                  <Button
                    className="text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-lg font-semibold"
                    variant="outline"
                    onClick={() => router.push(`/admin/tests/${test._id}`)}
                  >
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
