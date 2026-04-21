"use client";

import JobIcon from "./jobIcon";
import type { CategoryItem } from "@/api/category/getCategoriesPaginated";

interface JobCategoryCardProps {
  title: string;
  jobCount: number;
  onClick: () => void;
  selected?: boolean;
}

function JobCategoryCard({
  title,
  jobCount,
  onClick,
  selected,
}: JobCategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white
        rounded-2xl
        border
        p-4 sm:p-5
        h-full
        cursor-pointer
        transition-all duration-200
        group
        hover:border-blue-500
        hover:shadow-md
        hover:-translate-y-1
        ${selected
          ? "border-blue-600 shadow-md -translate-y-1"
          : "border-gray-200"
        }
      `}
    >
      <div className="flex flex-col items-start">
        {/* Icon */}
        <div
          className={`
            w-10 h-10 sm:w-12 sm:h-12
            rounded-xl
            flex items-center justify-center
            mb-3
            transition-colors
            ${selected
              ? "bg-blue-600 text-white"
              : "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white"
            }
          `}
        >
          <JobIcon name={title} className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>

        {/* Title */}
        <h3 className="font-semibold sm:font-bold text-gray-900 text-sm sm:text-base leading-snug min-h-[36px] sm:min-h-[40px]">
          {title}
        </h3>

        {/* Count */}
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 py-10 sm:py-12 md:py-14">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
            Explore by Category
          </h2>

          <button
            onClick={onViewAll}
            className="text-sm font-medium text-blue-600 hover:underline cursor-pointer self-start sm:self-auto"
          >
            View all →
          </button>
        </div>

        {/* Grid */}
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-6
            gap-3 sm:gap-4 md:gap-5
          "
        >
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