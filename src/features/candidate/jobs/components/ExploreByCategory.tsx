"use client";

import JobIcon from "./jobIcon";
import type { CategoryItem } from "@/api/category/getCategoriesPaginated";

interface JobCategoryCardProps {
  title: string;
  jobCount: number;
  onClick: () => void;
  selected?: boolean;
}
interface Props {
  categories: CategoryItem[];
  onSelect: (id: string) => void;
  onViewAll: () => void;
}


function JobCategoryCard({ title, jobCount, onClick, selected }: JobCategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
  bg-white
  rounded-2xl
  border
  px-5 py-5
  h-full
  cursor-pointer
  transition-all duration-200
  group
  hover:border-blue-500
  hover:shadow-md
  hover:-translate-y-1
  ${selected ? "border-blue-600 shadow-md -translate-y-1" : "border-gray-200"}
`}
    >
      <div className="flex flex-col items-start">
        {/* Icon */}
        <div
          className={`
  w-12 h-12
  rounded-xl
  flex items-center justify-center
  mb-3
  transition-colors
  ${selected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"}
`}
        >
          <JobIcon name={title} className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug min-h-[40px]">
          {title}
        </h3>

        {/* Count */}
        <p className="text-sm text-gray-500 mt-1">
          {jobCount} jobs
        </p>
      </div>
    </div>
  );
}

interface ExploreByCategoryProps {
  categories: CategoryItem[];
  onSelect: (categoryId: string) => void;
  onViewAll: () => void;
  selectedCategory?: string | null;
}

export default function ExploreByCategory({
  categories,
  onSelect,
  onViewAll,
  selectedCategory,
}: ExploreByCategoryProps) {
  return (
    <section className="bg-gray-50">
      <div className="max-w-7xl px-13 mt-5 mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            Explore by Category
          </h2>
          <button
            onClick={onViewAll}
            className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
          >
            View all →
          </button>


        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-6 gap-4 items-stretch ">

          {categories.slice(0, 6).map((cat) => (
            <JobCategoryCard
              key={cat._id}
              title={cat.name}
              jobCount={(cat as { jobCount?: number }).jobCount ?? 0}

              onClick={() => onSelect(cat._id)}
              selected={selectedCategory === cat._id}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
