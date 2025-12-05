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
  {/* Combined Search Input */}
  <div className="relative flex-1">
    <input
      type="text"
      placeholder="Search by Job Title, Keywords, or Location"
      className="w-full bg-gray-100 px-4 py-3 pr-10 rounded outline-none text-sm md:text-base
                 focus:ring-2 focus:ring-blue-500"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <MapPin
      size={18}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
    />
  </div>

  {/* Search Button */}
  <button
    onClick={() => console.log("Searching for:", searchTerm)}
    className="bg-blue-800 text-white px-6 py-3 rounded hover:bg-blue-900 
               w-full md:w-auto md:min-w-[120px] transition-all"
  >
    Search
  </button>
</div>

      </div>
    </div>
  );
}
