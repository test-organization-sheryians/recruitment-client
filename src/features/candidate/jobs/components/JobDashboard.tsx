"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import JobCard from "./JobCategoryCard";
import { Job as CardJob } from "@/types/Job";
import ExploreByCategory from "./ExploreByCategory";
import HeroSection from "./HeroSection";
import { Menu } from "lucide-react";
import FiltersSidebar from "./FiltersSidebar";
import LatestJobCard from "./LatestJobCard";
import CategoryExplorer from "./CategoryExplorer";
import CategoryCard from "./CategoryCard";
import { useGetProfile } from "@/features/candidate/Profile/hooks/useProfileApi";
import { useRouter } from "next/navigation";
import { useApplyJob } from "@/features/applyJobs/hooks/useApplyJob";
import { useToast } from "@/components/ui/Toast";

import { useDebounce } from "@/features/admin/users/hooks/useDebounce";

import { useInfiniteJobCategories } from "@/features/candidate/categories/hooks/useInfiniteCategories";
import {
  useInfiniteJobs,
  useInfiniteJobsByCategory,
} from "@/features/candidate/jobs/hooks/useInfiniteJobs";
import { useInfiniteSearchJobs } from "@/features/candidate/jobs/hooks/useInfiniteJobs";

import type { CategoryItem } from "@/api/category/getCategoriesPaginated";
import { SearchQuery } from "@/types/Job";
import { useQueryClient } from "@tanstack/react-query";

import { getJobQuestions } from "@/api/jobs/jobApplicationQuestion";

export default function JobDashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetProfile();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [query, setQuery] = useState<SearchQuery>({ q: "", location: "" });
  const router = useRouter();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const queryClient = useQueryClient();
  const applyJobMutation = useApplyJob();
  const toast = useToast();

  const handleApplyJob = async (jobId: string) => {
    if (profileLoading) {
      toast.error("Profile is loading. Please wait.");
      return;
    }

    if (!profile?.resumeFile) {
      toast.error("Please upload your resume before applying.");
      return;
    }

    try {
      const questions = await getJobQuestions(jobId);

      if (!questions || questions.length === 0) {
        applyJobMutation.mutate({
          jobId,
          message: "Excited to apply!",
          resumeUrl: profile.resumeFile,
        });
      } else {
        router.push(`/jobs/${jobId}/apply`);
      }
    } catch (err) {
      toast.error("Failed to check job requirements.");
    }
  };

  const {
    data: categoryPages,
    fetchNextPage: fetchNextCategories,
    hasNextPage: hasMoreCategories,
    isFetchingNextPage: isFetchingMoreCategories,
  } = useInfiniteJobCategories();

  const categories: CategoryItem[] = (categoryPages?.pages ?? []).flatMap(
    (p) => p.data ?? [],
  );

  const handleJobDetails = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  const [jobType, setJobType] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    0, 10000000,
  ]);

  const debouncedMinSalary = useDebounce(salaryRange[0], 600);
  const debouncedMaxSalary = useDebounce(salaryRange[1], 600);

  const allJobsQuery = useInfiniteJobs();
  const jobsByCategoryQuery = useInfiniteJobsByCategory(selectedCategory);

  const searchJobsQuery = useInfiniteSearchJobs({
    q: query.q,
    location: query.location,
    jobType,
    experience,
    minSalary: debouncedMinSalary,
    maxSalary: debouncedMaxSalary,
    category: selectedCategory ?? undefined,
  });

  const isSearchActive = Boolean(
    query.q ||
    query.location ||
    jobType.length ||
    experience.length ||
    !(salaryRange[0] === 0 && salaryRange[1] === 10000000),
  );

  const activeJobsQuery = isSearchActive
    ? searchJobsQuery
    : selectedCategory
      ? jobsByCategoryQuery
      : allJobsQuery;

  const jobsPages = activeJobsQuery.data?.pages ?? [];
  const jobs: CardJob[] = jobsPages.flatMap((p) => p.data ?? []);
  const jobsCount =
    jobsPages.length > 0 ? jobsPages[0]?.pagination?.totalRecords ?? 0 : 0;

  const jobsLoadMoreRef = useRef<HTMLDivElement | null>(null);

  const searchHandler = () => {
    setQuery({
      q: searchTerm.trim(),
      location: searchLocation.trim(),
    });
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* HERO */}
      <HeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={searchHandler}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
      />

      {/* CATEGORY */}
      {!showAllCategories && (
        <ExploreByCategory
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={(id) => {
            setSelectedCategory(id);
            setQuery({ q: "", location: "" });
          }}
          onViewAll={() => setShowAllCategories(true)}
        />
      )}

      {/* MOBILE FILTER BAR */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded bg-gray-100"
        >
          <Menu size={18} />
        </button>
        <span className="text-sm font-medium">
          {jobsCount} Jobs Found
        </span>
      </div>

      {/* MOBILE SIDEBAR */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm bg-white p-4 overflow-y-auto">
            <FiltersSidebar
              jobType={jobType}
              setJobType={setJobType}
              experience={experience}
              setExperience={setExperience}
              salaryRange={salaryRange}
              setSalaryRange={setSalaryRange}
              setSelectedCategory={setSelectedCategory}
            />
          </div>
        </div>
      )}

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* SIDEBAR */}
        <div className="hidden md:block md:col-span-4 lg:col-span-3">
          <FiltersSidebar
            jobType={jobType}
            setJobType={setJobType}
            experience={experience}
            setExperience={setExperience}
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
            setSelectedCategory={setSelectedCategory}
          />
        </div>

        {/* CONTENT */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* CATEGORY GRID */}
          {showAllCategories && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onClick={() => {
                    setSelectedCategory(category._id);
                    setShowAllCategories(false);
                  }}
                />
              ))}
            </div>
          )}

          {/* JOB LIST */}
          {!showAllCategories && (
            <div className="space-y-4">
              {jobs.map((job) => (
                <LatestJobCard
                  key={job._id}
                  jobId={job._id}
                  title={job.title}
                  company="Company"
                  location="Remote"
                  applied={job.applied}
                  onDetails={handleJobDetails}
                  onApply={handleApplyJob}
                />
              ))}
              <div ref={jobsLoadMoreRef} className="h-1" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}