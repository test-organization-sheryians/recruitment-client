"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import JobCard from "./JobCategoryCard";
import HeroSection from "./HeroSection";
import { Menu, X } from "lucide-react";
import { useGetJobCategories } from "@/features/admin/categories/hooks/useJobCategoryApi";
import { useGetJobs, useGetJobsByCategory } from "@/features/admin/jobs/hooks/useJobApi";

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

  // NEW: search term lifted from HeroSection
  const [searchTerm, setSearchTerm] = useState("");

  const { data: categories, isLoading: categoriesLoading } = useGetJobCategories();
  const jobsByCategory = useGetJobsByCategory(selectedCategory || "");
  const allJobs = useGetJobs();

  const jobsData = selectedCategory ? jobsByCategory.data : allJobs.data;
  const jobsLoading = selectedCategory ? jobsByCategory.isLoading : allJobs.isLoading;
  const jobs: Job[] = Array.isArray(jobsData) ? jobsData : [];

 // Safe lowercase search term
const term = searchTerm?.toLowerCase() || "";

// Type-safe filtering without ANY
const filteredJobs = jobs?.filter((job: Job) => {
  const titleMatch = job.title?.toLowerCase().includes(term);
  const departmentMatch = job.department?.toLowerCase().includes(term);

  const skillMatch = job.skills?.some((skill) => {
    const skillName = typeof skill === "string" ? skill : skill?.name;
    return skillName?.toLowerCase().includes(term);
  });

  return titleMatch || departmentMatch || skillMatch;
});

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Hero Section with search */}
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* MOBILE FILTER HEADER */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 sticky top-0 bg-blue-50 z-30 h-[56px]">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded bg-white shadow border"
        >
          <Menu size={22} className="text-gray-700" />
        </button>
        <h2 className="text-lg font-bold text-gray-800">Filters</h2>
      </div>

      {/* MOBILE SLIDE-IN SIDEBAR */}
      {isSidebarOpen && (
        <div className="md:hidden absolute left-0 z-40 flex w-full">
          <div className="fixed inset-0 bg-black/30" onClick={() => setIsSidebarOpen(false)}></div>

          <div className="relative bg-white w-64 h-[80vh] shadow-xl p-4 overflow-y-auto
            animate-slideIn border-r border-gray-300 rounded-r-lg">
            <button
              className="mb-4 flex items-center gap-1 text-sm font-medium text-gray-700"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X size={18} /> Close
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

      {/* PAGE GRID */}
      <div className="max-w-7xl mx-auto px-3 mt-[-20px] pb-10 grid grid-cols-12 gap-6">

        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-4">
          <Sidebar
            selected={selectedCategory}
            onSelect={(id: string) => setSelectedCategory(id)}
            categories={categories || []}
            isLoading={categoriesLoading}
          />
        </div>

        {/* JOB LISTING */}
        <div className="col-span-12 md:col-span-8">
   <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm
  overflow-y-auto max-h-[95vh] scrollbar-hide">



            {/* Title + Remove Filter Button */}
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg md:text-xl font-bold">
                {selectedCategory ? "Filtered Jobs" : "Recommended Jobs"}
              </h1>

              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-3 py-1 text-xs md:text-sm border border-gray-300 rounded-full bg-gray-100 
                  hover:bg-gray-200 text-gray-700"
                >
                  Remove Filter ✕
                </button>
              )}
            </div>

            {jobsLoading && <p className="text-gray-500 text-sm">Loading jobs...</p>}

            {!jobsLoading && filteredJobs.length === 0 && (
              <p className="text-gray-500 text-sm">No jobs found.</p>
            )}

            <div className="space-y-3 md:space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Animation */}
      <style>{`
        @keyframes slideIn {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
