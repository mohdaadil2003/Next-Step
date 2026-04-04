"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Pencil, Trash2, Users, Briefcase, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/helpers";
import { CATEGORY_OPTIONS, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/constants";
import type { JobData } from "@/components/jobs/JobCard";

const EMPTY_JOB = {
  title: "", location: "", category: "Technology", type: "Full Time",
  experience: "Fresher (0-1 yr)", salary: "", description: "",
  applyLink: "", deadline: "",
};

export default function EmployerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);
  const [form, setForm] = useState(EMPTY_JOB);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated" && session?.user?.role !== "EMPLOYER") {
      toast.error("Access denied"); router.push("/");
    }
  }, [status, session, router]);

  const [applicationCount, setApplicationCount] = useState(0);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const [jobsRes, appsRes] = await Promise.all([
        fetch("/api/jobs?mine=true&limit=100"),
        fetch("/api/applications?count=true"),
      ]);
      const jobsData = await jobsRes.json();
      setJobs(jobsData.data || []);
      const appsData = await appsRes.json();
      if (appsData.success) setApplicationCount(appsData.count || 0);
    } catch { toast.error("Failed to load jobs"); } finally { setLoading(false); }
  };

  useEffect(() => { if (status === "authenticated") fetchJobs(); }, [status]);

  const openCreate = () => { setEditingJob(null); setForm(EMPTY_JOB); setModalOpen(true); };
  const openEdit = (job: JobData) => {
    setEditingJob(job);
    setForm({
      title: job.title || "", location: job.location || "",
      category: job.category || "Technology", type: job.type || "Full Time",
      experience: job.experience || "Fresher (0-1 yr)", salary: job.salary || "",
      description: job.description || "", applyLink: "",
      deadline: job.deadline ? String(job.deadline).split("T")[0] : "",
    });
    setModalOpen(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { toast.error("Title and description are required"); return; }
    setSaving(true);
    try {
      const method = editingJob ? "PUT" : "POST";
      const url = editingJob ? `/api/jobs/${editingJob.id}` : "/api/jobs";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed"); }
      toast.success(editingJob ? "Job updated!" : "Job posted!");
      setModalOpen(false);
      fetchJobs();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Failed"); } finally { setSaving(false); }
  };

  const handleDelete = async (job: JobData) => {
    if (!window.confirm(`Delete "${job.title}"?`)) return;
    try { await fetch(`/api/jobs/${job.id}`, { method: "DELETE" }); toast.success("Deleted"); fetchJobs(); } catch { toast.error("Failed"); }
  };

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen pt-[68px]"><Loader2 size={36} className="text-primary animate-spin" /></div>;

  return (
    <div className="pt-[68px] pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center"><Briefcase size={24} className="text-primary" /></div>
              <div><p className="text-2xl font-bold text-text">{jobs.length}</p><p className="text-sm text-muted">Total Jobs</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center"><Eye size={24} className="text-green-600" /></div>
              <div><p className="text-2xl font-bold text-text">{jobs.filter((j) => j.isActive).length}</p><p className="text-sm text-muted">Active Jobs</p></div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-border/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center"><Users size={24} className="text-amber-600" /></div>
              <div><p className="text-2xl font-bold text-text">{applicationCount}</p><p className="text-sm text-muted">Applications</p></div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>My Job Listings</h1>
          <button onClick={openCreate} className="btn-primary inline-flex items-center gap-2"><Plus size={18} /> Post Job</button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20"><Loader2 size={36} className="text-primary animate-spin" /></div>
        ) : (
          <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/50 bg-gray-50/50">
                  <th className="text-left p-4 font-semibold text-muted">Title</th>
                  <th className="text-left p-4 font-semibold text-muted hidden md:table-cell">Category</th>
                  <th className="text-left p-4 font-semibold text-muted hidden lg:table-cell">Posted</th>
                  <th className="text-center p-4 font-semibold text-muted">Status</th>
                  <th className="text-right p-4 font-semibold text-muted">Actions</th>
                </tr></thead>
                <tbody>
                  {jobs.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12 text-muted">No jobs posted yet.</td></tr>
                  ) : jobs.map((job) => (
                    <tr key={job.id} className="border-b border-border/30 hover:bg-gray-50/50 transition">
                      <td className="p-4 font-medium text-text">{job.title}</td>
                      <td className="p-4 hidden md:table-cell"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">{job.category}</span></td>
                      <td className="p-4 text-muted hidden lg:table-cell">{formatDate(job.createdAt)}</td>
                      <td className="p-4 text-center"><span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${job.isActive ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>{job.isActive ? "Active" : "Inactive"}</span></td>
                      <td className="p-4"><div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEdit(job)} className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(job)} className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition"><Trash2 size={16} /></button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingJob ? "Edit Job" : "Post New Job"}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Title *</label><input name="title" value={form.title} onChange={handleChange} className="input-field" required /></div>
            <div><label className="block text-sm font-medium mb-1">Location</label><input name="location" value={form.location} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Category</label><select name="category" value={form.category} onChange={handleChange} className="input-field">{CATEGORY_OPTIONS.map((c) => <option key={c}>{c}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Type</label><select name="type" value={form.type} onChange={handleChange} className="input-field">{JOB_TYPES.map((t) => <option key={t}>{t}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Experience</label><select name="experience" value={form.experience} onChange={handleChange} className="input-field">{EXPERIENCE_LEVELS.map((e) => <option key={e}>{e}</option>)}</select></div>
            <div><label className="block text-sm font-medium mb-1">Salary</label><input name="salary" value={form.salary} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Deadline</label><input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="input-field" /></div>
            <div><label className="block text-sm font-medium mb-1">Apply Link</label><input name="applyLink" value={form.applyLink} onChange={handleChange} className="input-field" /></div>
          </div>
          <div><label className="block text-sm font-medium mb-1">Description *</label><textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field resize-none" /></div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="flex-1 btn-secondary">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {saving ? "Saving..." : editingJob ? "Update" : "Post Job"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
