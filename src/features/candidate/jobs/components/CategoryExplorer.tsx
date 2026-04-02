"use client";

import type { CategoryItem } from "@/api/category/getCategoriesPaginated";
import JobIcon from "./jobIcon";

interface CategoryExplorerProps {
  categories: CategoryItem[];
  onSelect: (categoryId: string) => void;
}

export default function CategoryExplorer({
  categories,
  onSelect,
}: CategoryExplorerProps) {
  return (
    <div className="bg-white rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">All Categories</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => onSelect(category._id)}
            className="
              bg-gray-50
              rounded-xl
              border border-gray-200
              px-4 py-4
              cursor-pointer
              transition-all duration-200
              group
              hover:border-blue-500
              hover:shadow-md
              hover:-translate-y-1
            "
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="
                  w-12 h-12
                  rounded-xl
                  bg-blue-50
                  flex items-center justify-center
                  mb-3
                  text-blue-600
                  transition-colors
                  group-hover:bg-blue-600
                  group-hover:text-white
                "
              >
                <JobIcon name={category.name} className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {category.name}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {category.jobCount ?? 0
                } jobs
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}