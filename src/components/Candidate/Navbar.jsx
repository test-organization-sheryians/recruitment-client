"use client";

import { Bookmark, Bell } from "lucide-react";

export default function Navbar() {
  return (
    <div className="w-full bg-white px-6 py-4 border-b shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">FoundJob</h1>

        <div className="flex items-center gap-6">
          <button className="px-6 py-2 border-2 border-gray-400 rounded-lg font-medium hover:bg-gray-50">Sign In</button>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-center gap-1">
              <Bookmark size={24} className="cursor-pointer hover:text-blue-600" />
              <span className="text-xs font-medium">Saved</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Bell size={24} className="cursor-pointer hover:text-blue-600" />
              <span className="text-xs font-medium">Updates</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold">Find Your Dream Job In Castle</h2>
        <p className="text-gray-600 text-sm mt-1">
          When you're searching for a job, there are a few things you can do to get the most out of your search.
        </p>
      </div>

      <div className="mt-4 relative">
        <input
          type="text"
          placeholder="Find Job In Your City"
          className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
