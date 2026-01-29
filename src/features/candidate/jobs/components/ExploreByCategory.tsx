"use client";

import JobIcon from "./jobIcon";
import type { CategoryItem } from "@/api/category/getCategoriesPaginated";

interface JobCategoryCardProps {
  title: string;
  jobCount: number;
  onClick: () => void;
}

function JobCategoryCard({ title, jobCount, onClick }: JobCategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-4
                 hover:shadow-md transition-all duration-200 cursor-pointer group"
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center
                     mb-3 group-hover:bg-blue-100 transition-colors text-blue-600"
        >
          <JobIcon name={title} className="w-6 h-6" />
        </div>

        <h3 className="font-semibold text-gray-900 text-sm mb-1">
          {title}
        </h3>

        <p className="text-xs text-gray-500">
          {jobCount} jobs
        </p>
      </div>
    </div>
  );
}

interface ExploreByCategoryProps {
  categories: CategoryItem[];
  onSelect: (categoryId: string) => void;
}

export default function ExploreByCategory({
  categories,
  onSelect,
}: ExploreByCategoryProps) {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Explore by Category
          </h2>
          <button className="text-sm font-medium text-blue-600 hover:underline">
            View all →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
          {categories.slice(0, 6).map((cat) => (
            <JobCategoryCard
              key={cat._id}
              title={cat.name}
              jobCount={(cat as any).jobCount ?? 0}
              onClick={() => onSelect(cat._id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
