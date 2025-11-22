"use client";

import { useState } from "react";
import JobCard from "@/components/JobCategoryCard";
import { SAMPLE_JOBS } from "@/components/Candidate/types";

export default function CandidateHomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categoryList = [
    "Fitness Trainer",
    "HR Executive",
    "Accountant",
    "Backend Developer",
    "Customer Manager",
    "Finance Executive",
    "Software Developer",
    "Video Editing",
    "Animation",
    
  ];

  const filteredJobs = SAMPLE_JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory ? job.department === selectedCategory : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="px-6 py-4">
      <div className="grid grid-cols-4 gap-6">
        {/* SIDEBAR - CATEGORIES */}
        <div className="col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-4 max-h-[calc(100vh-180px)] overflow-y-auto">
            <h3 className="text-lg font-bold mb-4">Job Category</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                  selectedCategory === null
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                All Jobs
              </button>
              {categoryList.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition-colors flex items-center gap-2 ${
                    selectedCategory === cat
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {/* <span className="text-lg">🔍</span> */}
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* JOB LISTINGS */}
        <div className="col-span-3">
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-2xl font-bold">Recommended Jobs</h2>
                <p className="text-gray-600 text-sm">Explore Suggested Job Searches</p>
              </div>
              <div className="flex gap-2">
                <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700">
                  Latest Job
                </button>
                <button className="px-6 py-2 bg-white border border-gray-300 rounded-full font-medium hover:bg-gray-50">
                  Premium Job
                </button>
              </div>
            </div>
          </div>

          {/* JOB CARDS */}
          <div className="space-y-1.5 max-h-[calc(100vh-260px)] overflow-y-auto pr-2 hide-scrollbar">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-500">No jobs found. Try adjusting your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
