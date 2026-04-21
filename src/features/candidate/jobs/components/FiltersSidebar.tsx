"use client";

interface FiltersSidebarProps {
  jobType: string[];
  setJobType: (v: string[]) => void;

  experience: string[];
  setExperience: (v: string[]) => void;

  salaryRange: [number, number];
  setSalaryRange: (v: [number, number]) => void;

  setSelectedCategory: (v: string | null) => void;
}

export default function FiltersSidebar({
  jobType,
  setJobType,
  experience,
  setExperience,
  salaryRange,
  setSalaryRange,
  setSelectedCategory,
}: FiltersSidebarProps) {
  const toggle = (
    list: string[],
    value: string,
    setter: (v: string[]) => void
  ) => {
    setter(
      list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value]
    );
  };

  const clearAll = () => {
    setJobType([]);
    setExperience([]);
    setSalaryRange([0, 10000000]);
    setSelectedCategory(null);
  };

  return (
    <div
      className="
        bg-white
        rounded-xl
        border border-gray-200
        shadow-sm
        p-4 sm:p-5
        md:sticky md:top-4
        max-h-[calc(100vh-80px)]
        overflow-y-auto
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-5">
        <h3 className="text-base sm:text-lg font-bold text-gray-900">
          Filters
        </h3>

        <button
          onClick={clearAll}
          className="text-xs sm:text-sm font-semibold text-blue-600 hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Job Type */}
      <div className="mb-5 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 tracking-wider">
          JOB TYPE
        </h4>

        <div className="space-y-2">
          {["Remote", "Full-Time", "Part-Time", "Hybrid"].map((type) => (
            <label
              key={type}
              className="flex items-center justify-between text-sm cursor-pointer p-2 rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={jobType.includes(type)}
                  onChange={() => toggle(jobType, type, setJobType)}
                  className="accent-blue-600 h-4 w-4 sm:h-5 sm:w-5 cursor-pointer"
                />
                <span className="text-sm sm:text-base text-gray-700">
                  {type}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-5 sm:mb-6">
        <h4 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 tracking-wider">
          EXPERIENCE LEVEL
        </h4>

        <div className="space-y-2">
          {["Entry", "Mid", "Senior"].map((level) => (
            <label
              key={level}
              className="flex items-center gap-3 text-sm cursor-pointer p-2 rounded-lg hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={experience.includes(level)}
                onChange={() => toggle(experience, level, setExperience)}
                className="accent-blue-600 h-4 w-4 sm:h-5 sm:w-5 cursor-pointer"
              />
              <span className="text-sm sm:text-base text-gray-700">
                {level} Level
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Salary (Optional - Uncomment when needed) */}
      {/*
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-gray-500 mb-3 tracking-wider">
          SALARY RANGE (₹)
        </h4>

        <input
          type="range"
          min={0}
          max={10000000}
          step={50000}
          value={salaryRange[1]}
          onChange={(e) =>
            setSalaryRange([salaryRange[0], Number(e.target.value)])
          }
          className="w-full accent-blue-600"
        />

        <div className="flex justify-between text-xs sm:text-sm text-gray-700 mt-2">
          <span>₹{(salaryRange[0] / 100000).toFixed(0)} L</span>
          <span>
            ₹
            {salaryRange[1] >= 10000000
              ? "1 Cr+"
              : `${(salaryRange[1] / 100000).toFixed(0)} L`}
          </span>
        </div>
      </div>
      */}
    </div>
  );
}