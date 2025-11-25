"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import JobCard from "./JobCategoryCard";
import { SAMPLE_JOBS } from "@/components/Candidate/types";
import HeroSection from "./HeroSection";
import { Menu } from "lucide-react";
import { useGetJobCategories } from "@/features/admin/categories/hooks/useJobCategoryApi";

export default function JobDashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { data: categories, isLoading } = useGetJobCategories();

  return (
    <div className="min-h-screen bg-blue-50">
      <HeroSection />

      {/* Mobile Header with Hamburger */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 bg-blue-50 z-30">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded bg-white shadow border"
        >
          <Menu size={22} className="text-gray-700" />
        </button>

        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
      </div>

      {/* Mobile Sidebar Drawer */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 md:hidden">
          <div className="absolute left-0 h-full w-64 bg-white shadow-xl p-4">
            <button
              className="mb-4 text-sm font-medium text-gray-700 underline"
              onClick={() => setIsSidebarOpen(false)}
            >
              Close
            </button>

            <Sidebar
              selected={selectedCategory}
              onSelect={(c) => {
                setSelectedCategory(c);
                setIsSidebarOpen(false);
              }}
              categories={categories || []}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-3 mt-[-20px] grid grid-cols-12 gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-4">
          <Sidebar
            selected={selectedCategory}
            onSelect={(c) => setSelectedCategory(c)}
            categories={categories || []}
            isLoading={isLoading}
          />
        </div>

        {/* Job List */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm">
            <h1 className="text-lg md:text-xl font-bold mb-4">Recommended Jobs</h1>

            <div className="space-y-3 md:space-y-4">
              {SAMPLE_JOBS.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
