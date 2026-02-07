"use client";

import type { CategoryItem } from "@/api/category/getCategoriesPaginated";
import JobIcon from "./jobIcon";

interface CategoryCardProps {
  category: CategoryItem;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div
      onClick={onClick}
      className="
        bg-white
        rounded-2xl
        border border-gray-200
        px-6 py-6
        cursor-pointer
        transition-all duration-200
        group
        hover:border-blue-500
        hover:shadow-lg
        hover:-translate-y-1
      "
    >
      <div className="flex flex-col items-center text-center">
        <div
          className="
            w-16 h-16
            rounded-xl
            bg-blue-50
            flex items-center justify-center
            mb-4
            text-blue-600
            transition-colors
            group-hover:bg-blue-600
            group-hover:text-white
          "
        >
          <JobIcon name={category.name} className="w-8 h-8" />
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500">
          {category.jobCount ?? 0}
          jobs available
        </p>
      </div>
    </div>
  );
}