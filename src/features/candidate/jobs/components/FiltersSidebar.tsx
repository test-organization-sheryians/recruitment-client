"use client";

interface FiltersSidebarProps {
  jobType: string[];
  setJobType: (v: string[]) => void;

  experience: string[];
  setExperience: (v: string[]) => void;

  salaryRange: [number, number];
  setSalaryRange: (v: [number, number]) => void;
}

export default function FiltersSidebar({
  jobType,
  setJobType,
  experience,
  setExperience,
  salaryRange,
  setSalaryRange,
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
    setSalaryRange([0, 10000000]); // ₹0 – ₹1 Cr
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm py-7 p-5 sticky top-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button
          onClick={clearAll}
          className="text-xs font-bold text-blue-600 hover:underline font-sans cursor-pointer  "
        >
          Clear all
        </button>
      </div>

      {/* Job Type */}
{/* Job Type */}
<div className="mb-6 text-lg font-semibold" >
  <h4 className="text-sm font-semibold text-gray-500 mb-3 tracking-wider">
    JOB TYPE
  </h4>

  {["Remote", "Full-Time", "Part-Time", "Hybrid"].map((type) => (
    <label
      key={type}
      className="flex items-center justify-between text-sm mb-2 cursor-pointer "
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={jobType.includes(type)}
          onChange={() => toggle(jobType, type, setJobType)}
          className="accent-blue-600 h-4 w-4 border border-gray-100 cursor-pointer rounded-sm"
        />
        <span>{type}</span>
      </div>
    </label>
  ))}
</div>

      {/* Experience */}
      <div className="mb-6 text-lg font-semibold">
        <h4 className="text-sm font-semibold text-gray-500 mb-3 tracking-wider">
          EXPERIENCE LEVEL
        </h4>

        {["Entry", "Mid", "Senior"].map((level) => (
          <label
            key={level}
            className="flex items-center gap-2 text-sm mb-2 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={experience.includes(level)}
              onChange={() => toggle(experience, level, setExperience)}
              className="accent-blue-600 h-4 w-4 border border-gray-100 cursor-pointer rounded-sm"
            />
            <span>{level} Level</span>
          </label>
        ))}
      </div>

      {/* Salary */}
      <div>
        <h4 className="text-sm font-semibold text-gray-500 mb-4 tracking-wider">
          SALARY RANGE (₹)
        </h4>

        <input
          type="range"
          min={0}
          max={10000000} // 1 Cr
          step={50000}
          value={salaryRange[1]}
          onChange={(e) =>
            setSalaryRange([salaryRange[0], Number(e.target.value)])
          }
          className="w-full accent-blue-600"
        />

        <div className="flex justify-between text-sm text-gray-700 mt-3">
          <span>₹{(salaryRange[0] / 100000).toFixed(0)} L</span>
          <span>
            ₹
            {salaryRange[1] >= 10000000
              ? "1 Cr+"
              : `${(salaryRange[1] / 100000).toFixed(0)} L`}
          </span>
        </div>
      </div>
    </div>
  );
}
