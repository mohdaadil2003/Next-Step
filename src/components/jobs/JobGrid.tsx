"use client";

import JobCard, { type JobData } from "./JobCard";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-[#D4E0F0] p-5 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-[#E8F0FE]" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-[#E8F0FE] rounded w-3/4" />
          <div className="h-3 bg-[#E8F0FE] rounded w-1/2" />
        </div>
      </div>
      <div className="flex gap-2 mb-3">
        <div className="h-6 bg-[#E8F0FE] rounded-lg w-16" />
        <div className="h-6 bg-[#E8F0FE] rounded-lg w-20" />
        <div className="h-6 bg-[#E8F0FE] rounded-lg w-14" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-[#E8F0FE] rounded w-full" />
        <div className="h-3 bg-[#E8F0FE] rounded w-2/3" />
      </div>
      <div className="pt-3 border-t border-[#D4E0F0] flex justify-between">
        <div className="h-3 bg-[#E8F0FE] rounded w-16" />
        <div className="h-3 bg-[#E8F0FE] rounded w-24" />
      </div>
    </div>
  );
}

interface JobGridProps {
  jobs: JobData[];
  savedJobs?: string[];
  onToggleSave?: (job: JobData) => void;
  loading?: boolean;
}

export default function JobGrid({ jobs, savedJobs = [], onToggleSave, loading }: JobGridProps) {
  if (loading) {
    return (
      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#E8F0FE] flex items-center justify-center mb-6 text-3xl">
          &#128269;
        </div>
        <h3 className="text-xl font-bold text-[#0F1B2D] mb-2" style={{ fontFamily: "var(--font-display)" }}>
          No Jobs Found
        </h3>
        <p className="text-[#4A5A70] text-sm max-w-md">
          Try adjusting your search filters or check back later for new opportunities.
        </p>
      </div>
    );
  }

  const savedSet = new Set(savedJobs);

  return (
    <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
      {jobs.map((job) => (
        <JobCard
          key={job.id}
          job={job}
          isSaved={savedSet.has(job.id)}
          onToggleSave={onToggleSave}
        />
      ))}
    </div>
  );
}
