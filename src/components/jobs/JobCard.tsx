"use client";

import Link from "next/link";
import { Bookmark, Star, Clock, MapPin, IndianRupee, ArrowRight } from "lucide-react";
import { stringToColor, getDeadlineInfo } from "@/lib/helpers";

export interface JobData {
  id: string;
  title: string;
  company: string;
  companyId?: string;
  companyLogo?: string | null;
  category?: string | null;
  type?: string | null;
  salary?: string | null;
  location?: string | null;
  deadline?: string | null;
  experience?: string | null;
  description?: string | null;
  isUrgent?: boolean;
  isFeatured?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

interface JobCardProps {
  job: JobData;
  isSaved?: boolean;
  onToggleSave?: (job: JobData) => void;
}

export default function JobCard({ job, isSaved, onToggleSave }: JobCardProps) {
  const companyInitials = (job.company || "C")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const bgColor = stringToColor(job.company);
  const deadlineInfo = getDeadlineInfo(job.deadline);

  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group relative bg-white rounded-2xl border border-[#D4E0F0] overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(10,102,194,0.12)] hover:border-[#0A66C2]/30 block"
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
        style={{ background: "linear-gradient(90deg, #0A66C2, #00AAFF)" }}
      />

      {job.isFeatured && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full text-white text-xs font-semibold z-10"
          style={{ background: "linear-gradient(135deg, #F59E0B, #F97316)" }}
        >
          <Star size={12} fill="white" />
          Featured
        </div>
      )}

      <button
        onClick={(e) => { e.stopPropagation(); onToggleSave?.(job); }}
        className={`absolute top-3 ${job.isFeatured ? "right-24" : "right-3"} p-2 rounded-xl transition-all duration-200 z-10 ${
          isSaved
            ? "bg-[#0A66C2] text-white"
            : "bg-white/80 text-[#4A5A70] hover:bg-[#E8F0FE] hover:text-[#0A66C2]"
        }`}
        aria-label={isSaved ? "Unsave job" : "Save job"}
      >
        <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
      </button>

      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0"
            style={{ backgroundColor: bgColor }}
          >
            {companyInitials}
          </div>
          <div className="min-w-0">
            <h3
              className="text-base font-bold text-[#0F1B2D] leading-tight line-clamp-1"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {job.title}
            </h3>
            <p className="text-sm text-[#4A5A70] mt-0.5 line-clamp-1">{job.company}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          {job.type && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F0FE] text-[#0A66C2] text-xs font-medium">
              <Clock size={12} /> {job.type}
            </span>
          )}
          {job.location && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F0FE] text-[#0A66C2] text-xs font-medium">
              <MapPin size={12} /> {job.location}
            </span>
          )}
          {job.salary && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8F0FE] text-[#0A66C2] text-xs font-medium">
              <IndianRupee size={12} /> {job.salary}
            </span>
          )}
          {job.isUrgent && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-[#DC2626] text-xs font-medium">
              Urgent
            </span>
          )}
        </div>

        {job.description && (
          <p className="text-sm text-[#4A5A70] leading-relaxed line-clamp-2 mb-4">
            {job.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-[#D4E0F0]">
          {deadlineInfo ? (
            <span className="text-xs font-medium flex items-center gap-1" style={{ color: deadlineInfo.color }}>
              <Clock size={12} /> {deadlineInfo.text}
            </span>
          ) : (
            <span />
          )}
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#0A66C2] group-hover:gap-2 transition-all duration-200">
            View Details <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </Link>
  );
}
