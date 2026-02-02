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
import { useInfiniteJobCategories } from "@/features/candidate/categories/hooks/useInfiniteCategories";
import {
  useInfiniteJobs,
  useInfiniteJobsByCategory,
} from "@/features/candidate/jobs/hooks/useInfiniteJobs";
import { useInfiniteSearchJobs } from "@/features/candidate/jobs/hooks/useSearchJobs";
import type { CategoryItem } from "@/api/category/getCategoriesPaginated";
import { SearchQuery } from "@/types/Job";
import { useQueryClient } from "@tanstack/react-query";





export default function JobDashboardPage() {
  const { data: profile, isLoading: profileLoading } = useGetProfile()
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [query, setQuery] = useState<SearchQuery>({ q: "", location: "" });
  const router = useRouter();
  const [showAllCategories, setShowAllCategories] = useState(false);
  const queryClient = useQueryClient();


  

const applyJobMutation = useApplyJob()
const toast = useToast()

const handleApplyJob = (jobId: string) => {
  if (profileLoading) {
    toast.error("Profile is loading. Please wait.")
    return
  }

  if (!profile?.resumeFile) {
    toast.error("Please upload your resume before applying.")
    return
  }

  applyJobMutation.mutate({
    jobId,
    message: "Excited to apply!",
    resumeUrl: profile.resumeFile,
  })
}



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
  const handleJobDetails = (jobId: string) => {
  router.push(`/jobs/${jobId}`);
};


    // optional: refetch jobs so applied=true updates
   


  /* ================= FILTER STATES ================= */
  const [jobType, setJobType] = useState<string[]>([]);
  const [experience, setExperience] = useState<string[]>([]);
  const [salaryRange, setSalaryRange] = useState<[number, number]>([
    0,
    10000000,
  ]);
  /* ================================================= */

  const allJobsQuery = useInfiniteJobs();
  const jobsByCategoryQuery = useInfiniteJobsByCategory(selectedCategory);

  /* ✅ ONLY REAL CHANGE IS HERE */
  const searchJobsQuery = useInfiniteSearchJobs({
    q: query.q,
    location: query.location,
    jobType,
    experience,
    minSalary: salaryRange[0],
    maxSalary: salaryRange[1],
  } as any);

  const isSearchActive = Boolean(
    query.q ||
      query.location ||
      jobType.length ||
      experience.length ||
      salaryRange[0] !== 0 ||
      salaryRange[1] !== 10000000
  );

  const activeJobsQuery = isSearchActive
    ? searchJobsQuery
    : selectedCategory
    ? jobsByCategoryQuery
    : allJobsQuery;

  const jobsPages = activeJobsQuery.data?.pages ?? [];
  const hasMoreJobs = activeJobsQuery.hasNextPage;
  const fetchNextJobs = activeJobsQuery.fetchNextPage;
  const isFetchingMoreJobs = activeJobsQuery.isFetchingNextPage;

  const jobsCount =
    jobsPages.length > 0
      ? jobsPages[0]?.pagination?.totalRecords ?? 0
      : 0;

  const jobs: CardJob[] = jobsPages
    .flatMap((p) => p.data ?? [])
    .map((job) => ({
      ...job,
      salary:
        typeof job.salary === "number"
          ? String(job.salary)
          : typeof job.salary === "object" && job.salary !== null
          ? `${(job.salary as any).currency} ${(job.salary as any).min} - ${
              (job.salary as any).max
            }`
          : "",
      skills: job.skills?.map((s) =>
        typeof s === "string"
          ? { _id: s, name: s }
          : { _id: s._id ?? s.name, name: s.name }
      ),
    }));

  const categoriesLoadMoreRef = useRef<HTMLDivElement | null>(null);
  const jobsLoadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = categoriesLoadMoreRef.current;
    if (!el) return;

    const observer = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
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
      if (entries[0].isIntersecting && hasMoreJobs && !isFetchingMoreJobs) {
        fetchNextJobs();
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMoreJobs, isFetchingMoreJobs, fetchNextJobs]);

  const searchHandler = () => {
    setQuery({
      q: searchTerm.trim(),
      location: searchLocation.trim(),
    });
    setSelectedCategory(null);
    setSearchTerm("");
    setSearchLocation("");
  };

  return (
    <div className="min-h-screen bg-gray-50 border pt-15">
      <HeroSection
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onSearch={searchHandler}
        searchLocation={searchLocation}
        setSearchLocation={setSearchLocation}
      />

     {!showAllCategories && (
  <ExploreByCategory
    categories={categories}
    onSelect={(id) => {
      setSelectedCategory(id)
      setQuery({ q: "", location: "" })
    }}
    onViewAll={() => setShowAllCategories(true)}
  />
)}


      <div className="md:hidden sticky top-0 z-30 bg-gray-50 border-b border-gray-200 px-4 py-2.5 flex items-center gap-3">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="p-1.5 rounded bg-white border border-gray-300 shadow-sm"
        >
          <Menu size={18} className="text-gray-700" />
        </button>
        <span className="text-sm font-medium text-gray-800">
          {selectedCategory ? "Filtered" : "All Jobs"} • {jobsCount} found
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-12 py-6 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="hidden md:block md:col-span-3">
          <FiltersSidebar
            jobType={jobType}
            setJobType={setJobType}
            experience={experience}
            setExperience={setExperience}
            salaryRange={salaryRange}
            setSalaryRange={setSalaryRange}
          />
        </div>
        {/* Jobs */}
{showAllCategories ? (
  /* ================= ALL CATEGORIES VIEW ================= */
  <div className="md:col-span-9">
    <div className="bg-gray-50 rounded-2xl p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        All Categories
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <CategoryCard
            key={category._id}
            category={category}
            onClick={() => {
              setSelectedCategory(category._id)
              setShowAllCategories(false)
            }}
          />
        ))}
      </div>
    </div>
  </div>
) : (
  /* ================= JOB LIST (UNCHANGED) ================= */
  <div className="md:col-span-9">
    <div className="bg-white rounded-xl overflow-hidden w-full">
      {/* Header */}
      <div className="px-4 py-1 bg-gray-50 flex items-center gap-3">
        <h2 className="text-xl font-semibold text-gray-900">
          {selectedCategory ? "Category Jobs" : "Latest Jobs"}
        </h2>
        <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
          {jobsCount} jobs
        </span>
      </div>

      {/* Job list */}
      <div className="p-4 space-y-4 bg-gray-50">
        {jobs.map((job) => (
          <LatestJobCard
            key={job._id}
            jobId={job._id}
            title={job.title}
            company={(job as any).client?.company || "Company"}
            location={
              job.location?.city
                ? `${job.location.city}, ${job.location.country ?? ""}`
                : "Remote"
            }
            salary={job.salary}
            postedAt={job.createdAt ? "Recently" : undefined}
            skills={job.skills?.map((s) => typeof s === "string" ? s : s.name)}
            applied={job.applied}
            onDetails={handleJobDetails}
            onApply={handleApplyJob}
          />
        ))}

        <div ref={jobsLoadMoreRef} className="h-1" />
      </div>
    </div>
  </div>
)}


      </div>
    </div>
  );
}

