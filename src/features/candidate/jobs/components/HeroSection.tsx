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
    <div className="w-full px-6 ">
      <div
        className="relative max-w-293 mx-auto rounded-2xl overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: "url('https://static.vecteezy.com/system/resources/thumbnails/008/010/800/small_2x/minimalist-empty-room-with-gray-wall-and-wood-floor-3d-rendering-photo.jpg')",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <div className="relative z-10 px-6 py-14 md:py-18 text-center text-white">
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-none">
            Find your next{" "}
            <span className="text-blue-500">career- <br />defining</span> role
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Discover premium opportunities at world-class companies.
            Your professional journey starts here.
          </p>

          {/* Search Bar */}
          {/* Search Bar */}
<div className="mt-8 max-w-3xl mx-auto">
  <div className="bg-white rounded-lg shadow-2xl p-2">
    <div className="flex flex-col md:flex-row items-stretch gap-2 md:gap-0">
      
      {/* Job Input */}
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Job title or keywords"
          className="w-full pl-12 pr-4 py-4 rounded-xl md:rounded-r-none
                     bg-white text-gray-800 focus:outline-none
                     focus:ring-0 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Divider (desktop only) */}
      <div className="hidden md:flex items-center">
        <div className="h-8 w-px bg-gray-200" />
      </div>

      {/* Location Input */}
      <div className="relative flex-1 md:max-w-xs">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="City or remote"
          className="w-full pl-12 pr-4 py-4 rounded-xl md:rounded-l-none
                     bg-white text-gray-800 focus:outline-none
                     focus:ring-0 focus:border-transparent    "
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        />
      </div>

      {/* Button */}
      <button
        onClick={onSearch}
        className="px-8 py-4 rounded-lg bg-blue-600 text-white font-semibold
                   hover:bg-blue-700 transition shadow-lg
                   flex items-center justify-center gap-2"
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
