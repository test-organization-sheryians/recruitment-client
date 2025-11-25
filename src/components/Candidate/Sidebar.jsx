export default function Sidebar({
  selected,
  onSelect,
  categories = [],
  isLoading = false,
}) {
  return (
    <div className="bg-white p-3 md:p-5 w-full rounded-lg md:rounded-xl shadow-sm border">
      <h2 className="text-lg md:text-xl font-bold text-center">Job Category</h2>

      <div className="mt-3 md:mt-5 space-y-2 md:space-y-4">

        {/* ✅ Loading State */}
        {isLoading && (
          <p className="text-center text-gray-500 text-sm">Loading...</p>
        )}

        {/* ✅ Empty State */}
        {!isLoading && categories.length === 0 && (
          <p className="text-center text-gray-500 text-sm">
            No categories available
          </p>
        )}

        {/* ✅ Render Real Categories */}
        {!isLoading &&
          categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => onSelect?.(cat._id)}
              className={`w-full py-2 md:py-3 px-2 md:px-3 rounded-lg border text-sm md:text-[16px] font-medium transition-colors
                ${
                  selected === cat._id
                    ? "bg-blue-100 border-blue-500"
                    : "bg-gray-100 hover:bg-gray-200"
                }
              `}
            >
              {cat.name}
            </button>
          ))}
      </div>
    </div>
  );
}
