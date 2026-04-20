import { Search, MapPin, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { searchJobTitles } from "@/api/jobs/searchJobTitles";
import { searchLocations } from "@/api/jobs/searchLocations"; 

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch?: (term: string, location: string) => void;
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
  // ================= JOB STATES =================
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  // ================= DB JOB SUGGESTIONS =================
  const [dbSuggestions, setDbSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setDbSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const titles = await searchJobTitles(searchTerm);
        setDbSuggestions(titles);
      } catch {
        setDbSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ================= LOCATION STATES =================
  const [recentLocations, setRecentLocations] = useState<string[]>([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  const locationRef = useRef<HTMLInputElement>(null);

  // ================= DB LOCATION SUGGESTIONS =================  // 
  const [dbLocationSuggestions, setDbLocationSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!searchLocation.trim()) {
      setDbLocationSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const locations = await searchLocations(searchLocation);
        setDbLocationSuggestions(locations);
      } catch {
        setDbLocationSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchLocation]);

  // ================= JOB FUNCTIONS =================
  const handleFocus = () => {
    const stored = JSON.parse(localStorage.getItem("recent") || "[]");
    setRecentSearches(stored);
    setShowDropdown(true);
  };

  const saveSearch = (value: string) => {
    if (!value.trim()) return;

    let searches = JSON.parse(localStorage.getItem("recent") || "[]");
    searches = [value, ...searches.filter((s: string) => s !== value)].slice(
      0,
      5,
    );

    localStorage.setItem("recent", JSON.stringify(searches));
  };

  const deleteSearch = (value: string) => {
    const searches = JSON.parse(localStorage.getItem("recent") || "[]");
    const updated = searches.filter((s: string) => s !== value);

    localStorage.setItem("recent", JSON.stringify(updated));
    setRecentSearches(updated);

    if (updated.length === 0) {
      setShowDropdown(false);
    }
  };

  // ================= LOCATION FUNCTIONS =================
  const handleLocationFocus = () => {
    const stored = JSON.parse(localStorage.getItem("recentLocations") || "[]");
    setRecentLocations(stored);
    setShowLocationDropdown(true);
  };

  const saveLocation = (value: string) => {
    if (!value.trim()) return;

    let locations = JSON.parse(localStorage.getItem("recentLocations") || "[]");
    locations = [value, ...locations.filter((l: string) => l !== value)].slice(
      0,
      5,
    );

    localStorage.setItem("recentLocations", JSON.stringify(locations));
  };

  const deleteLocation = (value: string) => {
    const locations = JSON.parse(
      localStorage.getItem("recentLocations") || "[]",
    );
    const updated = locations.filter((l: string) => l !== value);

    localStorage.setItem("recentLocations", JSON.stringify(updated));
    setRecentLocations(updated);

    if (updated.length === 0) {
      setShowLocationDropdown(false);
    }
  };

  // ================= COMMON =================
  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const termToSearch = searchTerm.trim();
    const locationToSearch = searchLocation.trim();

    saveSearch(termToSearch);
    saveLocation(locationToSearch);

    onSearch?.(termToSearch, locationToSearch);

    setSearchTerm("");
    setSearchLocation("");
    setShowDropdown(false);
    setShowLocationDropdown(false);
    setDbSuggestions([]);
    setDbLocationSuggestions([]); // ✅ ADD
    inputRef.current?.blur();
    locationRef.current?.blur();
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="font-bold">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  // DB results take priority over localStorage
  const filteredSearches =
    dbSuggestions.length > 0
      ? dbSuggestions
      : searchTerm
        ? recentSearches.filter((item) =>
            item.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : recentSearches;

  // ADD: DB location results take priority over localStorage
  const filteredLocations =
    dbLocationSuggestions.length > 0
      ? dbLocationSuggestions
      : searchLocation
        ? recentLocations.filter((item) =>
            item.toLowerCase().includes(searchLocation.toLowerCase()),
          )
        : recentLocations;

  return (
    <div className="w-full px-6 mt-6">
      <div
        className="max-w-325 mx-auto rounded-2xl py-20 px-6 text-center text-white shadow-md"
        style={{
          background: `
            radial-gradient(circle at 20% 20%, rgba(59,130,246,0.25), transparent 40%),
            linear-gradient(130deg, #101a36 10%, #101a36 30%, #0f766e 100%)
          `,
        }}
      >
        <h1 className="text-5xl md:text-6xl font-bold leading-[1.1]">
          Find your next
          <br />
          <span className="bg-linear-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
            career-defining
          </span>{" "}
          role
        </h1>

        <p className="mt-6 text-xl text-blue-100/80 max-w-2xl mx-auto">
          Discover premium opportunities at world-class companies.
        </p>

        <div className="mt-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center bg-white rounded-xl shadow-2xl p-2">
            {/* ================= JOB INPUT ================= */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

              <input
                ref={inputRef}
                type="text"
                placeholder="Job title or keywords"
                className="w-full pl-12 pr-4 py-3 text-gray-700 rounded-lg focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleFocus}
                onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />

              {showDropdown && filteredSearches.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white text-gray-700 border shadow-lg rounded-lg mt-3 z-50 overflow-hidden">
                  {filteredSearches.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between pl-12 pr-3 py-3 hover:bg-gray-200"
                    >
                      <div
                        onMouseDown={() => {
                          setSearchTerm(item);
                          setShowDropdown(false);
                        }}
                        className="flex gap-3 cursor-pointer flex-1"
                      >
                        <Search className="w-4 h-4 text-gray-400" />
                        <span>{highlightText(item, searchTerm)}</span>
                      </div>

                      {/* Delete only for localStorage items */}
                      {dbSuggestions.length === 0 && (
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteSearch(item);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden md:block h-8 w-px bg-gray-200" />

            {/* ================= LOCATION INPUT ================= */}
            <div className="relative flex-1 w-full md:max-w-xs">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />

              <input
                ref={locationRef}
                type="text"
                placeholder="City or remote"
                className="w-full pl-12 pr-4 py-3 text-gray-700 rounded-lg focus:outline-none"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                onFocus={handleLocationFocus}
                onBlur={() =>
                  setTimeout(() => setShowLocationDropdown(false), 150)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />

              {showLocationDropdown && filteredLocations.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white text-gray-700 border shadow-lg rounded-lg mt-3 z-50 overflow-hidden">
                  {filteredLocations.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between pl-12 pr-3 py-3 hover:bg-gray-200"
                    >
                      <div
                        onMouseDown={() => {
                          setSearchLocation(item);
                          setShowLocationDropdown(false);
                        }}
                        className="flex gap-3 cursor-pointer flex-1"
                      >
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{highlightText(item, searchLocation)}</span>
                      </div>

                      {/* ADD: Delete only for localStorage items, not DB suggestions */}
                      {dbLocationSuggestions.length === 0 && (
                        <button
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            deleteLocation(item);
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ================= BUTTON ================= */}
            <button
              onClick={handleSearch}
              className="w-full md:w-auto px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Search Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}