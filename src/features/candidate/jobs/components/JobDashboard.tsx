"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import JobCard, { Job } from "./JobCategoryCard";
import HeroSection from "./HeroSection";
import { Menu, X } from "lucide-react";
import { useGetJobCategories } from "@/features/admin/categories/hooks/useJobCategoryApi";
import {
  useGetJobs,
  useGetJobsByCategory,
} from "@/features/admin/jobs/hooks/useJobApi";

// import search hook
import { useSearchJobs } from "../jobSearch/hooks/hook";

interface Category {
  _id: string;
  name: string;
}

const normalizeJobs = (data: Job[] | { data: Job[] }): Job[] => {
  if (Array.isArray(data)) return data;
  if ("data" in data && Array.isArray(data.data)) return data.data;
  return [];
};


type SearchQuery = {
  q: string;
  
  location: string;
};

export default function JobDashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation,setSearchLocation] = useState("")
// state manage for passing data
const [query, setQuery] = useState<SearchQuery>({
  q: "",
  location: "",
});
const {  data: searchedJobs, isLoading: searchLoading  } = useSearchJobs(query.q, query.location);
console.log("useSearchjob hook call and data ====>",searchedJobs)
console.log("side bar selection job ===>",selectedCategory)

  const { data: categories, isLoading: categoriesLoading } = useGetJobCategories();
  const jobsByCategory = useGetJobsByCategory(selectedCategory || "");

const { data: allJobs, isLoading: allJobsLoading } = useGetJobs();

  const isCategoryMode = !!selectedCategory;
// const isSearchMode = !selectedCategory && query.q.trim().length > 0;

const isSearchMode =
  !selectedCategory &&
  (query.q.trim().length > 0 || query.location.trim().length > 0);



let jobsData: Job[] = [];

if (isCategoryMode) {
  jobsData = normalizeJobs(jobsByCategory.data);
} else if (isSearchMode) {
  jobsData = normalizeJobs(searchedJobs);
} else {
  jobsData = normalizeJobs(allJobs);
}

  const jobsLoading =
  isCategoryMode
    ? jobsByCategory.isLoading
    : isSearchMode
    ? searchLoading
    : allJobsLoading;
console.log("check the final data array for passing card ==>",jobsData)
console.log("jobsData type:", Array.isArray(jobsData), jobsData);
  // const jobs: Job[] = Array.isArray(jobsData) ? jobsData : [];
// console.log("length of jobs after filter ===>",jobs.length,jobs)
  // const term = searchTerm.toLowerCase();

  // const filteredJobs = jobs.filter((job) => {
  //   const title = job.title?.toLowerCase() || "";
  //   const department = job.department?.toLowerCase() || "";
  //   const skills =
  //     job.skills
  //       ?.map((s) => (typeof s === "string" ? s : s.name || ""))
  //       .join(" ")
  //       .toLowerCase() || "";

  //   return (
  //     title.includes(term) || department.includes(term) || skills.includes(term)
  //   );
  // });

  const searchHandler = ()=>{
 setQuery({
    q: searchTerm,
    location: searchLocation,
  });
  }
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero with search */}
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm}  onSearch={searchHandler} searchLocation={searchLocation} setSearchLocation={setSearchLocation} />

      {/* Mobile Filter Bar */}
      <div className="md:hidden sticky top-0 z-30 bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 rounded bg-white border border-gray-300 shadow-sm"
        >
          <Menu size={18} className="text-gray-700" />
        </button>
        <span className="text-sm font-medium text-gray-800">
          {selectedCategory ? "Filtered" : "All Jobs"} • {jobsData.length}{" "}
          found
        </span>
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="bg-white w-72 h-full shadow-2xl p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold">Categories</h3>
              <button onClick={() => setIsSidebarOpen(false)} className="p-1">
                <X size={18} />
              </button>
            </div>
            <Sidebar
              selected={selectedCategory}
              onSelect={(id) => {
                setSelectedCategory(id);
                setIsSidebarOpen(false);
              }}
              categories={categories || []}
              isLoading={categoriesLoading}
            />
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden md:block md:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 sticky top-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              Job Categories
            </h3>
            <Sidebar
              selected={selectedCategory}
              onSelect={setSelectedCategory}
              categories={categories || []}
              isLoading={categoriesLoading}
            />
          </div>
        </div>

        {/* Job List */}
        <div className="md:col-span-9">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold text-gray-900">
                  {selectedCategory ? "Category Jobs" : "All Jobs"}
                </h2>
                <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
                  {jobsData.length} jobs
                </span>
              </div>
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs text-gray-600 hover:text-gray-900 underline"
                >
                  Clear filter
                </button>
              )}
            </div>

            {/* Loading */}
            {jobsLoading && (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-blue-600"></div>
                <p className="text-xs text-gray-500 mt-2">Loading jobs...</p>
              </div>
            )}

            {/* Empty State */}
            {!jobsLoading && jobsData.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-sm text-gray-500">
                  No jobs match your search.
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Try different keywords or clear filters.
                </p>
              </div>
            )}

            {/* Job Cards */}
            <div className="divide-y divide-transparent p-2">
              {jobsData?.map((job) => (
                <div
                  key={job._id}
                  className="py-5 first:pt-0 hover:bg-gray-50/70 transition-colors duration-150"
                >
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
