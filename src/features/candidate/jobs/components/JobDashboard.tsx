"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import JobCard, { Job as CardJob } from "./JobCategoryCard";
import HeroSection from "./HeroSection";
import { Menu, X } from "lucide-react";
import { useInfiniteJobCategories } from "@/features/candidate/categories/hooks/useInfiniteCategories";
import {
  useInfiniteJobs,
  useInfiniteJobsByCategory,
} from "@/features/candidate/jobs/hooks/useInfiniteJobs";
import type { CategoryItem } from "@/api/category/getCategoriesPaginated";

export default function JobDashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // const { data: profileCalInfo } = useProfileQuery();

  // const completion = profileCalInfo?.data ?? 0;
  // const isProfileCompleted = completion < 60;

  // console.log(isProfileCompleted);

  const {
    data: categoryPages,
    isLoading: categoriesLoading,
    fetchNextPage: fetchNextCategories,
    hasNextPage: hasMoreCategories,
    isFetchingNextPage: isFetchingMoreCategories,
  } = useInfiniteJobCategories();

  const categories: CategoryItem[] = (categoryPages?.pages ?? []).flatMap(
    (p) => p.data ?? []
  );

  const allJobsQuery = useInfiniteJobs();
  const jobsByCategoryQuery = useInfiniteJobsByCategory(selectedCategory);

  const activeJobsQuery = selectedCategory ? jobsByCategoryQuery : allJobsQuery;

  const jobsPages = activeJobsQuery.data?.pages ?? [];
  const jobsLoading = activeJobsQuery.isLoading;
  const hasMoreJobs = activeJobsQuery.hasNextPage;
  const fetchNextJobs = activeJobsQuery.fetchNextPage;
  const isFetchingMoreJobs = activeJobsQuery.isFetchingNextPage;

  const jobs: CardJob[] = jobsPages
    .flatMap((p) => p.data ?? [])
    .map((job) => ({
      ...job,
      salary: typeof job.salary === "number" ? String(job.salary) : job.salary,
      skills: job.skills?.map((s) =>
        typeof s === "string"
          ? { _id: s, name: s }
          : { _id: s._id ?? s.name, name: s.name }
      ),
    }));

  // Infinite scroll sentinels
  const categoriesLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const jobsLoadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = categoriesLoadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (
        entry.isIntersecting &&
        hasMoreCategories &&
        !isFetchingMoreCategories
      ) {
        fetchNextCategories();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMoreCategories, isFetchingMoreCategories, fetchNextCategories]);

  useEffect(() => {
    const el = jobsLoadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMoreJobs && !isFetchingMoreJobs) {
        fetchNextJobs();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMoreJobs, isFetchingMoreJobs, fetchNextJobs, selectedCategory]);

  const term = searchTerm.toLowerCase();

  const filteredJobs = jobs.filter((job) => {
    const title = job.title?.toLowerCase() || "";
    const department = job.department?.toLowerCase() || "";
    const skills =
      job.skills
        ?.map((s) => (typeof s === "string" ? s : s.name || ""))
        .join(" ")
        .toLowerCase() || "";

    return (
      title.includes(term) || department.includes(term) || skills.includes(term)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero with search */}
      <HeroSection searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Mobile Filter Bar */}
      <div className="md:hidden sticky top-0 z-30 bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 rounded bg-white border border-gray-300 shadow-sm"
        >
          <Menu size={18} className="text-gray-700" />
        </button>
        <span className="text-sm font-medium text-gray-800">
          {selectedCategory ? "Filtered" : "All Jobs"} • {filteredJobs.length}{" "}
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
              loadMoreRef={categoriesLoadMoreRef}
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
              loadMoreRef={categoriesLoadMoreRef}
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
                  {filteredJobs.length} jobs
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
            {!jobsLoading && filteredJobs.length === 0 && (
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
              {filteredJobs.map((job) => (
                <div
                  key={job._id}
                  className="py-5 first:pt-0 hover:bg-gray-50/70 transition-colors duration-150"
                >
                  <JobCard job={job} />
                </div>
              ))}
              {/* Infinite scroll sentinel for jobs */}
              <div ref={jobsLoadMoreRef} className="h-1" />
              {isFetchingMoreJobs && (
                <div className="p-4 text-center text-xs text-gray-500">
                  Loading more…
                </div>
              )}
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
