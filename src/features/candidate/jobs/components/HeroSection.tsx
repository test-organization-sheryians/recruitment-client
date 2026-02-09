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
    <div className="w-full px-6 mt-6">
      <div
        className="
        max-w-325
        mx-auto
        rounded-2xl
        py-20
        px-6
        text-center
        text-white
        shadow-md
      "
        style={{
          background: `
    radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 40%),
    linear-gradient(130deg, #101a36 10%, #101a36 30%, #0f766e 100%)
  `,
        }}
      >
        {/* Heading */}
        <h1 className="text-5xl md:text-6xl font-bold tracking-[-0.02em] leading-[1.1]">
          Find your next
          <br />
          <span className="bg-linear-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
            career-defining
          </span>{" "}
          role
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed font-normal">
          Discover premium opportunities at world-class companies.
          <br />
          Your professional journey starts here.
        </p>

        {/* Search */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div
            className="
            flex flex-col md:flex-row items-center
            bg-white
            rounded-xl
            shadow-2xl
            p-2
          "
          >
            {/* Job */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Job title or keywords"
                className="
                  w-full
                  pl-12
                  pr-4
                  py-4
                  text-gray-700
                  rounded-lg
                  focus:outline-none
                "
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Divider */}
            <div className="hidden md:block h-8 w-px bg-gray-200" />

            {/* Location */}
            <div className="relative flex-1 w-full md:max-w-xs">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
              <input
                type="text"
                placeholder="City or remote"
                className="
                  w-full
                  pl-12
                  pr-4
                  py-4
                  text-gray-700
                  rounded-lg
                  focus:outline-none
                "
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>

            {/* Button */}
            <button
              onClick={onSearch}
              className="
                w-full md:w-auto
                px-8
                py-4
                rounded-lg
                bg-blue-600
                hover:bg-blue-700
                text-white
                font-semibold
                transition
                flex items-center justify-center gap-2
              "
            >
              <Search className="w-5 h-5" />
              Search Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}