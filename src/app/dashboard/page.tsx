"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Briefcase, Bookmark, FileText, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { formatDate } from "@/lib/helpers";

export default function JobSeekerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState<"applications" | "saved">("applications");
  const [applications, setApplications] = useState<Array<{
    id: string; status: string; createdAt: string;
    job: { title: string; company: { name: string }; location?: string | null };
  }>>([]);
  const [savedJobs, setSavedJobs] = useState<Array<{
    id: string; savedAt: string;
    job: { id: string; title: string; company: { name: string }; location?: string | null };
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated" && session?.user?.role !== "JOB_SEEKER") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    setLoading(true);
    Promise.all([
      fetch("/api/applications").then((r) => r.json()),
      fetch("/api/saved-jobs").then((r) => r.json()),
    ])
      .then(([appData, savedData]) => {
        setApplications(appData.applications || []);
        setSavedJobs(savedData.savedJobs || []);
      })
      .catch(() => toast.error("Failed to load data"))
      .finally(() => setLoading(false));
  }, [status]);

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "resume");
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        toast.success("Resume uploaded successfully!");
      } else {
        const data = await res.json();
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen pt-[68px]"><Loader2 size={36} className="text-primary animate-spin" /></div>;
  }

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-50 text-amber-700",
    REVIEWED: "bg-blue-50 text-blue-700",
    SHORTLISTED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-600",
    ACCEPTED: "bg-emerald-50 text-emerald-700",
  };

  return (
    <div className="pt-[68px] pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
              Welcome, {session?.user?.name?.split(" ")[0]}
            </h1>
            <p className="text-muted text-sm mt-1">Track your applications and saved jobs</p>
          </div>
          <div>
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} className="hidden" />
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-secondary inline-flex items-center gap-2 text-sm">
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading..." : "Upload Resume"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
          <button onClick={() => setTab("applications")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${tab === "applications" ? "bg-white text-primary shadow-sm" : "text-muted"}`}>
            <Briefcase size={16} /> Applications ({applications.length})
          </button>
          <button onClick={() => setTab("saved")} className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition ${tab === "saved" ? "bg-white text-primary shadow-sm" : "text-muted"}`}>
            <Bookmark size={16} /> Saved ({savedJobs.length})
          </button>
        </div>

        {/* Applications */}
        {tab === "applications" && (
          <div className="space-y-3">
            {applications.length === 0 ? (
              <div className="text-center py-16">
                <FileText size={48} className="text-muted/30 mx-auto mb-4" />
                <p className="text-muted">No applications yet. Start exploring jobs!</p>
              </div>
            ) : applications.map((app) => (
              <div key={app.id} className="bg-white rounded-xl border border-border/50 p-4 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text">{app.job.title}</p>
                  <p className="text-sm text-muted">{app.job.company.name} {app.job.location ? `\u2022 ${app.job.location}` : ""}</p>
                  <p className="text-xs text-muted mt-1">Applied {formatDate(app.createdAt)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status] || "bg-gray-100 text-muted"}`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Saved */}
        {tab === "saved" && (
          <div className="space-y-3">
            {savedJobs.length === 0 ? (
              <div className="text-center py-16">
                <Bookmark size={48} className="text-muted/30 mx-auto mb-4" />
                <p className="text-muted">No saved jobs yet. Browse and save jobs you like!</p>
              </div>
            ) : savedJobs.map((saved) => (
              <div key={saved.id} className="bg-white rounded-xl border border-border/50 p-4 flex items-center justify-between cursor-pointer hover:border-primary/30 transition" onClick={() => router.push(`/jobs/${saved.job.id}`)}>
                <div>
                  <p className="font-semibold text-text">{saved.job.title}</p>
                  <p className="text-sm text-muted">{saved.job.company.name} {saved.job.location ? `\u2022 ${saved.job.location}` : ""}</p>
                  <p className="text-xs text-muted mt-1">Saved {formatDate(saved.savedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
