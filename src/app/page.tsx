"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Loader2, AlertCircle, SlidersHorizontal } from "lucide-react";

import Hero from "@/components/home/Hero";
import TrustBar from "@/components/home/TrustBar";
import HowItWorks from "@/components/home/HowItWorks";
import PartnersMarquee from "@/components/home/PartnersMarquee";
import SearchBar from "@/components/ui/SearchBar";
import CategoryGrid from "@/components/jobs/CategoryGrid";
import JobGrid from "@/components/jobs/JobGrid";
import TestimonialSlider from "@/components/home/TestimonialSlider";
import Newsletter from "@/components/home/Newsletter";
import type { JobData } from "@/components/jobs/JobCard";
import { useSavedJobs } from "@/lib/useSavedJobs";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest First" },
  { value: "deadline", label: "Deadline Soonest" },
  { value: "salary", label: "Salary High to Low" },
];

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 size={40} className="text-primary animate-spin" /></div>}>
      <HomePageContent />
    </Suspense>
  );
}

function HomePageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalJobs, setTotalJobs] = useState(0);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [locationQuery, setLocationQuery] = useState(searchParams.get("location") || "");
  const [activeFilter, setActiveFilter] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "latest");

  const { savedJobs, toggleSave } = useSavedJobs();

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      if (locationQuery.trim()) params.set("location", locationQuery.trim());
      if (activeFilter) params.set("category", activeFilter);
      params.set("sort", sortBy);
      params.set("limit", "50");

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.data);
        setTotalJobs(data.pagination?.total ?? data.data.length);
      } else {
        throw new Error(data.error || "Failed to load jobs");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load jobs");
      setJobs([]);
      setTotalJobs(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, locationQuery, activeFilter, sortBy]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (locationQuery.trim()) params.set("location", locationQuery.trim());
    if (activeFilter) params.set("category", activeFilter);
    if (sortBy !== "latest") params.set("sort", sortBy);
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/", { scroll: false });
  }, [searchQuery, locationQuery, activeFilter, sortBy, router]);

  const handleSearch = (query: string, location: string) => {
    setSearchQuery(query);
    setLocationQuery(location || "");
  };

  const handleCategoryClick = (category: string) => {
    setActiveFilter((prev) => (prev === category ? "" : category));
    document.getElementById("jobs-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSaveJob = (job: JobData) => {
    toggleSave(job.id);
  };

  const handleNewsletterSubscribe = async (email: string) => {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Subscribed successfully! Check your inbox.");
      } else {
        toast.error(data.error || "Subscription failed.");
      }
    } catch {
      toast.error("Subscription failed. Please try again.");
    }
  };

  return (
    <div className="pt-[68px]">
      <Hero />
      <TrustBar />

      {/* Search */}
      <section className="relative -mt-8 z-10 px-4">
        <div className="max-w-4xl mx-auto">
          <SearchBar onSearch={handleSearch} initialQuery={searchQuery} initialLocation={locationQuery} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8" style={{ fontFamily: "var(--font-display)" }}>
            Browse by Category
          </h2>
          <CategoryGrid activeCategory={activeFilter} onCategoryClick={handleCategoryClick} />
        </div>
      </section>

      <HowItWorks />
      <PartnersMarquee />

      {/* Job Listings */}
      <section id="jobs-section" className="py-12 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
                {activeFilter ? `${activeFilter} Jobs` : "Latest Opportunities"}
              </h2>
              <p className="text-muted mt-1">
                {loading ? "Loading..." : `${totalJobs} job${totalJobs !== 1 ? "s" : ""} found`}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={16} className="text-muted" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-xl border border-border bg-white text-sm font-medium text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {activeFilter && (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveFilter("")}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-primary text-white transition hover:bg-primary-dark"
              >
                {activeFilter} <span className="ml-1 text-white/80">&times;</span>
              </button>
              <button
                onClick={() => { setActiveFilter(""); setSearchQuery(""); setLocationQuery(""); setSortBy("latest"); }}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-gray-100 text-muted hover:bg-gray-200 transition"
              >
                Clear All
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={40} className="text-primary animate-spin mb-4" />
              <p className="text-muted text-sm">Loading opportunities...</p>
            </div>
          )}

          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <AlertCircle size={40} className="text-danger mb-4" />
              <p className="text-danger font-medium mb-2">Something went wrong</p>
              <p className="text-muted text-sm mb-4">{error}</p>
              <button onClick={fetchJobs} className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition hover:-translate-y-0.5" style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}>
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && (
            <JobGrid jobs={jobs} savedJobs={savedJobs} onToggleSave={handleSaveJob} />
          )}
        </div>
      </section>

      <TestimonialSlider />
      <Newsletter onSubscribe={handleNewsletterSubscribe} />
    </div>
  );
}
