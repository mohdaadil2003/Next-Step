"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string, location: string) => void;
  initialQuery?: string;
  initialLocation?: string;
}

export default function SearchBar({ onSearch, initialQuery = "", initialLocation = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query, location);
  };

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row items-stretch bg-white rounded-2xl shadow-[0_4px_24px_rgba(10,102,194,0.1)] border border-[#D4E0F0] overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-4 flex-[2] border-b sm:border-b-0 sm:border-r border-[#D4E0F0]">
          <Search size={20} className="text-[#4A5A70] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Job title, keyword, or company"
            className="w-full bg-transparent text-sm text-[#0F1B2D] placeholder:text-[#4A5A70]/60 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2 px-5 py-4 flex-1 border-b sm:border-b-0 sm:border-r border-[#D4E0F0]">
          <MapPin size={20} className="text-[#4A5A70] shrink-0" />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full bg-transparent text-sm text-[#0F1B2D] placeholder:text-[#4A5A70]/60 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 px-8 py-4 text-white text-sm font-semibold transition-all duration-200 hover:opacity-90"
          style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
        >
          <Search size={18} />
          <span>Search</span>
        </button>
      </form>
    </div>
  );
}
