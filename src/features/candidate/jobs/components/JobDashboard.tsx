"use client";

import { useEffect, useState, useRef } from "react";
import Sidebar from "./Sidebar";
import JobCard, { Job } from "./JobCategoryCard";
import HeroSection from "./HeroSection";
import { Menu, X } from "lucide-react";
import { useGetJobCategories } from "@/features/admin/categories/hooks/useJobCategoryApi";
import {
  useGetJobs,
  useGetJobsByCategory,
} from "@/features/admin/jobs/hooks/useJobApi";
import { log } from "console";

import { useSearchJobs } from "../jobSearch/hooks/hook";

interface Category {
  _id: string;
  name: string;
}

const normalizeJobs = (data: any): Job[] => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data)) return data.data;
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

const [query, setQuery] = useState<SearchQuery>({
  q: "",
  location: "",
});
const [page, setPage] = useState(1);
const limit = 2;

const isCategoryMode = !!selectedCategory;
const isSearchMode =
  !selectedCategory &&
  (query.q.trim().length > 0 || query.location.trim().length > 0);

const {  data: searchedJobs, isLoading: searchLoading , isFetching: searchFetching } = useSearchJobs(query.q, query.location, page, limit);

  // accumulated search results for infinite scroll
  const [accumulatedJobs, setAccumulatedJobs] = useState<Job[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // reset accumulated results when query changes
  useEffect(() => {
    if (!isSearchMode) return;
    setAccumulatedJobs([]);
    setTotalPages(1);
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query.q, query.location, selectedCategory]);

  // append fetched page to accumulated list
  useEffect(() => {
    if (!isSearchMode) return;
    const pageData = searchedJobs?.data ?? [];
    const tp = searchedJobs?.totalPage ?? 1;
    setTotalPages(tp);

    if (page === 1) {
      setAccumulatedJobs(pageData);
    } else if (pageData.length > 0) {
      setAccumulatedJobs((prev) => {
        const ids = new Set(prev.map((j) => j._id));
        const appended = pageData.filter((j: Job) => !ids.has(j._id));
        return [...prev, ...appended];
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchedJobs]);

  // infinite scroll observer
  useEffect(() => {
    if (!isSearchMode) return;
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (
          first.isIntersecting &&
          !searchFetching &&
          page < (totalPages ?? 1)
        ) {
          setPage((p) => p + 1);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSearchMode, sentinelRef.current, searchFetching, page, totalPages]);

// const totalPages = searchedJobs?.totalPages ?? 1;
// const { data: profileCalInfo } = useProfileQuery();

// const completion = profileCalInfo?.data ?? 0;
// const isProfileCompleted = completion < 60;

// console.log(isProfileCompleted);
  
 console.log("data form backend to check page 2==>",searchedJobs)
  

  const { data: categories, isLoading: categoriesLoading } =
    useGetJobCategories();
  const jobsByCategory = useGetJobsByCategory(selectedCategory || "");

const { data: allJobs, isLoading: allJobsLoading } = useGetJobs();




let jobsData: Job[] = [];

if (isCategoryMode) {
  jobsData = normalizeJobs(jobsByCategory.data);
} else if (isSearchMode) {
  jobsData = accumulatedJobs;
} else {
  jobsData = normalizeJobs(allJobs);
}

  const jobsLoading =
  isCategoryMode
    ? jobsByCategory.isLoading
    : isSearchMode
    ? searchLoading
    : allJobsLoading;

  const searchHandler = ()=>{
    setPage(1)
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
                  <JobCard job={job}/>
                </div>
              ))}
            </div>
          </div>
            {/* Infinite scroll sentinel for search mode */}
            {isSearchMode && (
              <div className="flex flex-col items-center py-6">
                <div ref={sentinelRef} />
                {searchFetching && (
                  <span className="text-xs text-gray-400">Loading more...</span>
                )}
                {!searchFetching && page >= (totalPages ?? 1) && (
                  <span className="text-sm text-gray-600">End of results</span>
                )}
              </div>
            )}



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
