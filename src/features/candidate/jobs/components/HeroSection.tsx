import { Search, MapPin } from "lucide-react";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch?: () => void;
  searchLocation: string;
  setSearchLocation: React.Dispatch<React.SetStateAction<string>>;
}

export default function HeroSection({
  searchTerm,
  setSearchTerm,
  onSearch,
  searchLocation,
  setSearchLocation,
}: HeroSectionProps) {
  return (
    <div className="w-full px-6 mt-8">
      <div
        className="relative max-w-7xl mx-auto rounded-3xl overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/hero.jpeg')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 px-6 py-20 md:py-28 text-center text-white">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Find your next{" "}
            <span className="text-blue-500">career-defining</span> role
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Discover premium opportunities at world-class companies.
            Your professional journey starts here.
          </p>

          {/* Search Bar */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex flex-col md:flex-row gap-2">
                {/* Job Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Job title or keywords"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-800
                               focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Location Input */}
                <div className="relative flex-1 md:max-w-xs">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="City or remote"
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-white text-gray-800
                               focus:outline-none focus:ring-2 focus:ring-blue-600"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                  />
                </div>

                {/* Button */}
                <button
                  onClick={onSearch}
                  className="px-8 py-4 rounded-xl bg-blue-600 text-white font-semibold
                             hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search Jobs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
