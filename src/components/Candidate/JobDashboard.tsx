"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import JobCard from "./JobCategoryCard";
import HeroSection from "./HeroSection";
import { Menu } from "lucide-react";
import { useGetJobCategories } from "@/features/admin/categories/hooks/useJobCategoryApi";
import { useGetJobs, useGetJobsByCategory } from "@/features/admin/jobs/hooks/useJobApi";

// Define types
interface Category {
  _id: string;
  name: string;
}

interface Job {
  _id: string;
  title: string;
  category?: Category | string;
  requiredExperience?: string;
  education?: string;
  salary?: string;
  department?: string;
  expiry?: string | Date;
  skills?: Array<{ _id: string; name: string } | string>;
  description?: string;
}

export default function JobDashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useGetJobCategories();

  // Fetch jobs based on selected category
  const { data: jobsData, isLoading: jobsLoading } = selectedCategory
    ? useGetJobsByCategory(selectedCategory)
    : useGetJobs();

  const jobs: Job[] = Array.isArray(jobsData) ? jobsData : [];

  console.log("Selected category ID:", selectedCategory);
  console.log("Jobs returned:", jobs);

  return (
    <div className="min-h-screen bg-blue-50">
      <HeroSection />

      {/* Mobile Header */}
<div className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 bg-blue-50 z-30 h-[56px]">
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
<div className="absolute left-0 top-[200px] w-64 h-[calc(100%-160px)] bg-white shadow-xl p-4 rounded-tr-lg overflow-y-auto">
      <button
        className="mb-4 text-sm font-medium text-gray-700 underline"
        onClick={() => setIsSidebarOpen(false)}
      >
        Close
      </button>

      <Sidebar
        selected={selectedCategory}
        onSelect={(id: string) => {
          setSelectedCategory(id);
          setIsSidebarOpen(false);
        }}
        categories={categories || []}
        isLoading={categoriesLoading}
      />
    </div>
  </div>
)}


      {/* Main Layout */}
      <div className="max-w-7xl mx-auto px-3 mt-[-20px] pb-10 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="hidden md:block md:col-span-4">
          <Sidebar
            selected={selectedCategory}
            onSelect={(id: string) => setSelectedCategory(id)}
            categories={categories || []}
            isLoading={categoriesLoading}
          />
        </div>

        {/* Job List */}
        <div className="col-span-12 md:col-span-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm  overflow-y scrollbar-hide">
            <h1 className="text-lg md:text-xl font-bold mb-4">Recommended Jobs</h1>

            {/* Loading State */}
            {jobsLoading && <p className="text-gray-500 text-sm">Loading jobs...</p>}

            {/* Empty State */}
            {!jobsLoading && jobs.length === 0 && (
              <p className="text-gray-500 text-sm">No jobs found for this category.</p>
            )}

            {/* Jobs List */}
            <div className="space-y-3 md:space-y-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
