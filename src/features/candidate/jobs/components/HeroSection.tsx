import { Search, MapPin } from "lucide-react";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch?: () => void;
  searchLocation: string;
  setSearchLocation: (value: string) => void;
}

export default function HeroSection({
  searchTerm,
  setSearchTerm,
  onSearch,
  searchLocation,
  setSearchLocation
}: HeroSectionProps) {
  return (
    <div
      className="w-full py-16 md:py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50 
                  bg-no-repeat bg-right bg-cover relative overflow-hidden"
      style={{
        backgroundImage: "url('/images/hero.jpeg')",
        backgroundBlendMode: "overlay",
        backgroundPosition: "center right",
      }}
    >
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        {/* Main Heading - Professional Size */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
          Find Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Dream Job
          </span>
        </h1>

        {/* Subtitle - Clean & Readable */}
        <p className="mt-4 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
          Search thousands of jobs from top companies — all in one place.
        </p>

        {/* PROFESSIONAL SEARCH BAR */}
        <div className="mt-10 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-3 
                          transition-all duration-300 hover:shadow-2xl hover:border-gray-300">
            <div className="flex flex-col lg:flex-row gap-3">
              {/* Job Title / Keywords */}
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  className="w-full pl-12 pr-4 py-4 text-base text-gray-800 bg-gray-50 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                             transition-all duration-200 placeholder:text-gray-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
                />
              </div>

              {/* Location */}
              <div className="relative flex-1 lg:max-w-xs">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  placeholder="City, state, or Remote"
                  className="w-full pl-12 pr-4 py-4 text-base text-gray-800 bg-gray-50 rounded-xl
                             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white
                             transition-all duration-200 placeholder:text-gray-500"
                  value={searchLocation}
                  onChange={(e)=>setSearchLocation(e.target.value)}
                />
              </div>

              {/* Search Button - Perfect Size */}
              <button
                onClick={onSearch}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold
                           text-base rounded-xl hover:from-blue-700 hover:to-indigo-700
                           active:scale-98 transition-all duration-200 shadow-lg hover:shadow-xl
                           flex items-center justify-center gap-2"
              >
                <Search className="w-5 h-5" />
                Search Jobs
              </button>
            </div>
          </div>

          {/* Popular Tags - Subtle & Professional */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {["Remote Jobs", "Full Time", "React Developer", "Senior", "Startup"].map((tag) => (
              <button
                key={tag}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-full
                           hover:bg-blue-100 hover:text-blue-700 transition-all duration-200
                           border border-gray-200"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Indicator */}
        <div className="mt-12">
          <p className="text-gray-600 text-sm">
            Trusted by <span className="font-bold text-blue-600">10,000+</span> job seekers every month
          </p>
        </div>
      </div>
    </div>
  );
}