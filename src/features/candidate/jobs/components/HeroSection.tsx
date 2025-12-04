import { Search, MapPin } from "lucide-react";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
}

export default function HeroSection({ searchTerm, setSearchTerm }: HeroSectionProps) {
  return (
    <div
      className="w-full py-10 md:py-20 bg-no-repeat bg-right bg-cover md:bg-contain"
      style={{
        backgroundImage: "url('/images/hero.jpeg')",
        backgroundPosition: "center right"
      }}
    >
      <div className="max-w-6xl mx-auto px-4 text-center">

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-gray-800 tracking-tight leading-tight">
          Find your dream job
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 mt-3 text-sm sm:text-base md:text-xl">
          Search by job title, keywords, or location.
        </p>

        {/* SEARCH BAR */}
        <div
          className="mt-10 bg-white p-3 md:p-4 rounded-lg shadow-md 
                     flex flex-col md:flex-row gap-3 border w-full max-w-3xl mx-auto"
        >
          {/* Job Input */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded flex-1 gap-2">
            <Search size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Job Title or Keywords"
              className="flex-1 bg-transparent outline-none text-sm md:text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Location Input (optional, not used for filtering yet) */}
          <div className="flex items-center bg-gray-100 px-3 py-2 rounded flex-1 gap-2">
            <MapPin size={18} className="text-gray-500" />
            <input
              type="text"
              placeholder="Location"
              className="flex-1 bg-transparent outline-none text-sm md:text-base"
            />
          </div>

          {/* Button (optional, could trigger search) */}
          <button className="bg-blue-800 text-white px-6 py-2 rounded hover:bg-blue-900 w-full md:w-auto">
            Search
          </button>
        </div>
      </div>
    </div>
  );
}
