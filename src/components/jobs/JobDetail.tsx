"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MapPin, Briefcase, Clock, DollarSign, Calendar, Building2, Bookmark, Share2 } from "lucide-react";
import toast from "react-hot-toast";
import { getDaysLeft, formatDate, buildWhatsAppUrl, getInitials } from "@/lib/helpers";
import { WHATSAPP_NUMBER, COLORS } from "@/lib/constants";
import { useSavedJobs } from "@/lib/useSavedJobs";
import type { JobData } from "@/components/jobs/JobCard";

export interface JobDetailData extends JobData {
  requirements?: string[];
  applyLink?: string | null;
  companyWebsite?: string | null;
}

export default function JobDetail({ job }: { job: JobDetailData }) {
  const { isSaved, toggleSave } = useSavedJobs();
  const saved = isSaved(job.id);

  const handleSave = () => {
    toggleSave(job.id);
    toast.success(saved ? "Job removed from saved" : "Job saved!");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: job.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleApplyWhatsApp = () => {
    const msg = `Hi! I'm interested in the "${job.title}" position at ${job.company}. I found it on NEXT STEP. Could you please share more details?`;
    window.open(buildWhatsAppUrl(WHATSAPP_NUMBER, msg), "_blank", "noopener");
  };

  const daysLeft = getDaysLeft(job.deadline);
  const initials = getInitials(job.company);
  const color = COLORS[(job.company?.length || 0) % COLORS.length];

  return (
    <div className="pt-[68px] pb-16 animate-fade-up">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-primary transition">
          <ArrowLeft size={16} /> Back to all jobs
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ background: `linear-gradient(135deg, ${color}, ${color}dd)` }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-text mb-1" style={{ fontFamily: "var(--font-display)" }}>{job.title}</h1>
                  <p className="text-muted flex items-center gap-1.5"><Building2 size={15} /> {job.company}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} className={`p-2.5 rounded-xl border transition ${saved ? "bg-primary/10 border-primary text-primary" : "border-border text-muted hover:border-primary hover:text-primary"}`} aria-label={saved ? "Remove from saved" : "Save job"}>
                    <Bookmark size={18} fill={saved ? "currentColor" : "none"} />
                  </button>
                  <button onClick={handleShare} className="p-2.5 rounded-xl border border-border text-muted hover:border-primary hover:text-primary transition" aria-label="Share job">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {job.location && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700"><MapPin size={12} /> {job.location}</span>}
                {job.type && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700"><Briefcase size={12} /> {job.type}</span>}
                {job.experience && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700"><Clock size={12} /> {job.experience}</span>}
                {job.salary && <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700"><DollarSign size={12} /> {job.salary}</span>}
                {job.deadline && <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${daysLeft <= 3 ? "bg-red-50 text-red-700" : "bg-gray-100 text-muted"}`}><Calendar size={12} /> {daysLeft <= 0 ? "Expired" : `${daysLeft} days left`}</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {job.description && (
              <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold mb-4">Job Description</h2>
                <div className="text-muted leading-relaxed whitespace-pre-line">{job.description}</div>
              </div>
            )}
            {job.requirements && job.requirements.length > 0 && (
              <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold mb-4">Requirements</h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted">
                      <span className="text-primary mt-0.5">&#10003;</span> {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold mb-4">Interested in this role?</h3>
              {job.applyLink && (
                <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all mb-3" style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}>
                  Apply Now
                </a>
              )}
              <button onClick={handleApplyWhatsApp} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition hover:-translate-y-0.5" style={{ background: "#25D366" }}>
                Ask via WhatsApp
              </button>
              {job.createdAt && (
                <p className="text-xs text-muted text-center mt-4">Posted on {formatDate(job.createdAt)}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
