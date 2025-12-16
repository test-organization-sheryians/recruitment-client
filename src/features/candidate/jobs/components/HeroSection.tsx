"use client";

import { Search, MapPin } from "lucide-react";

interface HeroSectionProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  onSearch?: () => void;
}

export default function HeroSection({
  searchTerm,
  setSearchTerm,
  onSearch,
}: HeroSectionProps) {
  return (
    <section className="relative w-full min-h-[75vh] flex items-center justify-center px-6">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero.jpeg')" }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/40 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-4xl text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-white leading-tight drop-shadow-xl">
          Find the opportunities
          <span className="block mt-2 text-blue-300 font-bold">
            that shape your future
          </span>
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-200 max-w-xl mx-auto drop-shadow">
          Discover the best jobs tailored for your skills, industry, and goals.
        </p>

        <div className="mt-10">
          <div
            className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl 
                          p-4 rounded-3xl max-w-3xl mx-auto"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Job title or keywords"
                  className="w-full pl-12 pr-4 py-3 bg-white/20 text-white placeholder-white/60 
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  onKeyDown={(e) => e.key === "Enter" && onSearch?.()}
                />
              </div>

              <div className="relative flex-1 lg:max-w-xs">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 w-5" />
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full pl-12 pr-4 py-3 bg-white/20 text-white placeholder-white/60 
                             rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>

              <button
                onClick={onSearch}
                className="px-8 py-3 bg-blue-500/90 hover:bg-blue-600 text-white rounded-xl 
                           transition-all shadow-lg backdrop-blur-lg whitespace-nowrap"
              >
                Search
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {["Remote", "Full Time", "React Developer", "UI/UX", "Backend"].map(
              (tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchTerm(tag)}
                  className="px-4 py-2 bg-white/20 border border-white/30 text-white 
                           backdrop-blur-md text-sm rounded-full hover:bg-white/30 transition-all"
                >
                  {tag}
                </button>
              )
            )}
          </div>
        </div>

        <div className="mt-10">
          <p className="text-gray-200 text-sm">
            Trusted by{" "}
            <span className="text-blue-300 font-semibold">15,000+</span>{" "}
            professionals worldwide
          </p>
        </div>
      </div>
    </section>
  );
}
