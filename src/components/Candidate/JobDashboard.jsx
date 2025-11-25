  "use client";

  import { useState, useEffect } from "react";
  import Sidebar from "./Sidebar";
  import JobCard from "./JobCategoryCard";
  import HeroSection from "./HeroSection";
  import { Menu } from "lucide-react";
  import { getJobs } from "@/api/jobs"; // adjust this path if needed
  import { useGetJobCategories } from "@/features/admin/categories/hooks/useJobCategoryApi";

  export default function JobDashboardPage() {
    const [jobs, setJobs] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // FETCH JOBS FROM BACKEND
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await getJobs();
          setJobs(result.data || result); // depends on your API structure
        } catch (err) {
          console.error("Error fetching jobs:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }, []);

    // FILTER JOBS BY CATEGORY
    const filteredJobs = selectedCategory
      ? jobs.filter((job) => job.category === selectedCategory)
      : jobs;

    const { data: categories, isLoading } = useGetJobCategories();

    return (
      <div className="min-h-screen bg-blue-50">
        <HeroSection />

        {/* Mobile Header */}
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

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-3 mt-[-20px]  pb-10 grid grid-cols-12 gap-6">

          {/* Sidebar */}
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
  <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm 
                  max-h-[75vh] overflow-y-auto scrollbar-hide">


              <h1 className="text-lg md:text-xl font-bold mb-4">Recommended Jobs</h1>

              {/* Loading State */}
              {loading && (
                <p className="text-gray-500 text-sm">Loading jobs...</p>
              )}

              {/* Empty State */}
              {!loading && filteredJobs.length === 0 && (
                <p className="text-gray-500 text-sm">
                  No jobs found for this category.
                </p>
              )}

              {/* Job Cards */}
              <div className="space-y-3 md:space-y-4">
                {filteredJobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>
    );
  }
