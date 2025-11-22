"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import JobCard from "./JobCategoryCard";

export default function JobDashboardPage() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">

     
      <div className="w-full">
        <Navbar />
      </div>

    
      <div className="mt-8 max-w-7xl mx-auto grid grid-cols-12 gap-6 px-6">

        <div className="col-span-4">
          <Sidebar
            selected={selectedCategory}
            onSelect={(c) => setSelectedCategory(c)}
          />
        </div>

       
        <div className="col-span-8">
          <h1 className="text-2xl font-bold">Recommended Jobs</h1>

          <div className="mt-5 space-y-5">
            <JobCard />
            <JobCard />
            <JobCard />
          </div>
        </div>

      </div>
    </div>
  );
}