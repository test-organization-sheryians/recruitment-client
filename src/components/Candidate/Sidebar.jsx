export default function Sidebar({ selected, onSelect }) {
  const categories = [
    "Fitness Trainer",
    "HR Executive",
    "Accountant",
    "Backend Developer",
    "Customer Manager",
    "Finance Executive",
    "Software Developer",
  ];

  return (
    <div className="bg-white p-3 md:p-5 w-full rounded-lg md:rounded-xl shadow-sm border md:h-[80vh] overflow-y-auto">
      <h2 className="text-lg md:text-xl font-bold text-center">Job Category</h2>

      <div className="mt-3 md:mt-5 space-y-2 md:space-y-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect?.(cat)}
            className={`w-full py-2 md:py-3 px-2 md:px-3 rounded-lg border text-sm md:text-[16px] font-medium transition-colors
              ${selected === cat ? "bg-blue-100 border-blue-500" : "bg-gray-100 hover:bg-gray-200"}
            `}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  );
}