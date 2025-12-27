"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Clock, GraduationCap, EllipsisVertical, Search } from "lucide-react";
import Modal from "@/components/ui/Modal"; // Add this import


import {
  useGetAllTests,
  usePublishTestResult,
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
  const [discloseModalOpen, setDiscloseModalOpen] = useState(false);
  const [disclosingTestId, setDisclosingTestId] = useState<string | null>(null);
  const [publishStatus, setPublishStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const { data, isLoading, isError } = useGetAllTests();
  const { mutate, isPending } = usePublishTestResult();


  const tests: Test[] = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return [...data].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [data]); // Added the latest on the top

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

  const selectedTest = tests.find(test => test._id === disclosingTestId);

  const handleDiscloseResult = () => {
    if (!disclosingTestId) return;
    
    setPublishStatus('loading');
    mutate(disclosingTestId, {
      onSuccess: () => {
        setPublishStatus('success');
        setTimeout(() => {
          setDiscloseModalOpen(false);
          setPublishStatus('idle');
          setDisclosingTestId(null);
        }, 2000);
      },
      onError: (error) => {
        setPublishStatus('error');
        setTimeout(() => setPublishStatus('idle'), 3000);
      }
    });
  };

  const openDiscloseModal = (testId: string) => {
    setDisclosingTestId(testId);
    setDiscloseModalOpen(true);
    setPublishStatus('idle');
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
                    className="absolute right-[-1vw] top-10 duration-200 w-44 bg-white border shadow-lg rounded-md z-30"
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
                      Enroll
                    </button>

                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                      onClick={() => {
                        setEditTestId(test._id);
                        setOpenMenu(null);
                      }}
                    >
                      Edit Test
                    </button>

                    {!test.showResults && (
                      <button
                        className="w-full px-4 py-2 text-left hover:bg-gray-50"
                        onClick={() => openDiscloseModal(test._id)}
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
      <Modal
        isOpen={discloseModalOpen}
        onClose={() => {
          setDiscloseModalOpen(false);
          setDisclosingTestId(null);
          setPublishStatus('idle');
        }}
        title="Disclose Test Results"
        maxWidth="md"
      >
        <div className="space-y-4">
          {publishStatus === 'idle' && selectedTest && (
            <>
              <p className="text-gray-600">
                Are you sure you want to disclose results for <strong>&quot;{selectedTest.title}&quot;</strong>?
              </p>
              <p className="text-sm text-gray-500">
                This will set <code className="bg-gray-100 px-1 py-0.5 rounded">showResults: true</code> and notify all graded candidates via email.
              </p>
            </>
          )}

          {publishStatus === 'loading' && (
            <div className="flex flex-col items-center py-8">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Publishing results and sending emails...</p>
              <p className="text-sm text-gray-500">This may take a few moments</p>
            </div>
          )}

          {publishStatus === 'success' && (
            <div className="flex flex-col items-center py-8 text-black">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Results Published Successfully!</h3>
              <p className="text-sm">Candidates have been notified via email.</p>
            </div>
          )}

          {publishStatus === 'error' && (
            <div className="flex flex-col items-center py-8 text-red-600">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold">Failed to Publish Results</h3>
              <p className="text-sm">Please try again or contact support.</p>
            </div>
          )}

          {/* Action buttons - only show when not loading/success/error */}
          {publishStatus === 'idle' && (
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setDiscloseModalOpen(false);
                  setDisclosingTestId(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDiscloseResult}
                className="flex-1 bg-blue-700/80 hover:bg-blue-800"
                disabled={isPending}
              >
                Disclose Results
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}