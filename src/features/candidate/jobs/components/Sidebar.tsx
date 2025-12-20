import React from "react";

interface Category {
  _id: string;
  name: string;
}

interface SidebarProps {
  selected: string | null;
  onSelect?: (id: string) => void;
  categories?: Category[];
  isLoading?: boolean;
  loadMoreRef?: React.RefObject<HTMLDivElement>;
}

const Sidebar: React.FC<SidebarProps> = ({
  selected,
  onSelect,
  categories = [],
  isLoading = false,
  loadMoreRef,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5">
        Job Categories
      </h2>

      <nav className="space-y-1">
        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="h-10 bg-gray-100 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && categories.length === 0 && (
          <p className="text-center text-gray-400 text-xs py-6">
            No categories found
          </p>
        )}

        {/* Categories */}
        {!isLoading &&
          categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelect?.(cat._id)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200
                flex items-center justify-between group
                ${
                  selected === cat._id
                    ? "bg-blue-50 text-blue-700 border border-blue-300 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 border border-transparent"
                }
              `}
            >
              <span>{cat.name}</span>

              {/* Active indicator */}
              {selected === cat._id && (
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}

        {/* Infinite scroll sentinel */}
        {!isLoading && <div ref={loadMoreRef} className="h-1" />}
      </nav>

      {/* Optional: All Jobs Button */}
      <button
        onClick={() => onSelect?.("")}
        className={`mt-6 w-full py-3 px-4 rounded-lg text-sm font-medium transition-all
          ${
            selected === null || selected === ""
              ? "bg-blue-50 text-blue-700 border border-blue-300"
              : "text-gray-600 hover:bg-gray-50 border border-gray-200"
          }`}
      >
        All Jobs
      </button>
    </div>
  );
};

export default Sidebar;
