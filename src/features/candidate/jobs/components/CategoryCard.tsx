"use client";

import type { CategoryItem } from "@/api/category/getCategoriesPaginated";
import JobIcon from "./jobIcon";

interface CategoryCardProps {
  category: CategoryItem;
  onClick: () => void;
}

export default function CategoryCard({
  category,
  onClick,
}: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        bg-white
        rounded-2xl
        border border-gray-200
        p-4 sm:p-5 md:p-6
        h-full
        cursor-pointer
        transition-all duration-200
        group
        hover:border-blue-500
        hover:shadow-lg
        hover:-translate-y-1
      "
    >
      <div className="flex flex-col items-center text-center h-full">
        {/* Icon */}
        <div
          className="
            w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
            rounded-xl
            bg-blue-50
            flex items-center justify-center
            mb-3 sm:mb-4
            text-blue-600
            transition-colors
            group-hover:bg-blue-600
            group-hover:text-white
          "
        >
          <JobIcon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" name={category.name} />
        </div>

        {/* Title */}
        <h3 className="
          font-semibold sm:font-bold
          text-gray-900
          text-sm sm:text-base md:text-lg
          mb-1 sm:mb-2
          leading-snug
          line-clamp-2
        ">
          {category.name}
        </h3>

        {/* Count */}
        <p className="text-xs sm:text-sm text-gray-500 mt-auto">
          {category.jobCount ?? 0} jobs available
        </p>
      </div>
    </div>
  );
}