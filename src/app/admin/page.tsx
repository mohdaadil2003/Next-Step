"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Pencil, Trash2, LogOut } from "lucide-react";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import Modal from "@/components/ui/Modal";
import { formatDate } from "@/lib/helpers";
import { CATEGORY_OPTIONS, JOB_TYPES, EXPERIENCE_LEVELS } from "@/lib/constants";
import type { JobData } from "@/components/jobs/JobCard";

const EMPTY_JOB = {
  title: "", company: "", location: "", category: "Technology",
  type: "Full Time", experience: "Fresher (0-1 yr)", salary: "",
  description: "", requirements: "", applyLink: "", deadline: "",
};

function JobFormModal({ isOpen, onClose, job, onSave }: {
  isOpen: boolean; onClose: () => void; job: JobData | null;
  onSave: (form: typeof EMPTY_JOB) => Promise<void>;
}) {
  const [form, setForm] = useState(EMPTY_JOB);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (job) {
      setForm({
        title: job.title || "", company: job.company || "", location: job.location || "",
        category: job.category || "Technology", type: job.type || "Full Time",
        experience: job.experience || "Fresher (0-1 yr)", salary: job.salary || "",
        description: job.description || "", requirements: "",
        applyLink: "", deadline: job.deadline ? String(job.deadline).split("T")[0] : "",
      });
    } else {
      setForm(EMPTY_JOB);
    }
  }, [job, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) { toast.error("Title and description are required"); return; }
    setSaving(true);
    try { await onSave(form); onClose(); } catch (err) { toast.error(err instanceof Error ? err.message : "Failed to save job"); } finally { setSaving(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={job ? "Edit Job" : "Add New Job"}>
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className="block text-sm font-medium mb-1">Title *</label><input name="title" value={form.title} onChange={handleChange} className="input-field" required /></div>
          <div><label className="block text-sm font-medium mb-1">Location</label><input name="location" value={form.location} onChange={handleChange} className="input-field" placeholder="e.g. Mumbai, Remote" /></div>
          <div><label className="block text-sm font-medium mb-1">Category</label><select name="category" value={form.category} onChange={handleChange} className="input-field">{CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Job Type</label><select name="type" value={form.type} onChange={handleChange} className="input-field">{JOB_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Experience</label><select name="experience" value={form.experience} onChange={handleChange} className="input-field">{EXPERIENCE_LEVELS.map((e) => <option key={e} value={e}>{e}</option>)}</select></div>
          <div><label className="block text-sm font-medium mb-1">Salary</label><input name="salary" value={form.salary} onChange={handleChange} className="input-field" placeholder="e.g. 4-6 LPA" /></div>
          <div><label className="block text-sm font-medium mb-1">Deadline</label><input name="deadline" type="date" value={form.deadline} onChange={handleChange} className="input-field" /></div>
          <div><label className="block text-sm font-medium mb-1">Apply Link</label><input name="applyLink" value={form.applyLink} onChange={handleChange} className="input-field" placeholder="https://..." /></div>
        </div>
        <div><label className="block text-sm font-medium mb-1">Description *</label><textarea name="description" value={form.description} onChange={handleChange} rows={4} className="input-field resize-none" /></div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 btn-secondary">Cancel</button>
          <button type="submit" disabled={saving} className="flex-1 btn-primary flex items-center justify-center gap-2">
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            {saving ? "Saving..." : job ? "Update Job" : "Create Job"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/signin");
    if (status === "authenticated" && session?.user?.role !== "ADMIN") {
      toast.error("Access denied — admin only"); router.push("/");
    }
  }, [status, session, router]);

  const fetchAllJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/jobs?limit=100");
      const data = await res.json();
      setJobs(data.data || []);
    } catch { toast.error("Failed to load jobs"); } finally { setLoading(false); }
  };

  useEffect(() => { if (status === "authenticated") fetchAllJobs(); }, [status]);

  const handleSave = async (form: typeof EMPTY_JOB) => {
    const method = editingJob ? "PUT" : "POST";
    const url = editingJob ? `/api/jobs/${editingJob.id}` : "/api/jobs";
    const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to save"); }
    toast.success(editingJob ? "Job updated!" : "Job created!");
    fetchAllJobs();
  };

  const handleDelete = async (job: JobData) => {
    if (!window.confirm(`Delete "${job.title}"? This cannot be undone.`)) return;
    try {
      await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
      toast.success("Job deleted");
      fetchAllJobs();
    } catch { toast.error("Failed to delete job"); }
  };

  const handleToggleActive = async (job: JobData) => {
    try {
      await fetch(`/api/jobs/${job.id}`, { method: "PATCH" });
      toast.success(job.isActive ? "Job deactivated" : "Job activated");
      fetchAllJobs();
    } catch { toast.error("Failed to update status"); }
  };

  if (status === "loading" || loading) {
    return <div className="flex items-center justify-center min-h-screen pt-[68px]"><Loader2 size={36} className="text-primary animate-spin" /></div>;
  }

  return (
    <div className="pt-[68px] pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>Admin Dashboard</h1>
            <p className="text-muted mt-1">{jobs.length} total job listings</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setEditingJob(null); setModalOpen(true); }} className="btn-primary inline-flex items-center gap-2"><Plus size={18} /> Add Job</button>
            <button onClick={() => signOut()} className="btn-secondary inline-flex items-center gap-2 text-sm"><LogOut size={16} /> Logout</button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-border/50 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-gray-50/50">
                  <th className="text-left p-4 font-semibold text-muted">Title</th>
                  <th className="text-left p-4 font-semibold text-muted hidden sm:table-cell">Company</th>
                  <th className="text-left p-4 font-semibold text-muted hidden md:table-cell">Category</th>
                  <th className="text-left p-4 font-semibold text-muted hidden lg:table-cell">Posted</th>
                  <th className="text-center p-4 font-semibold text-muted">Status</th>
                  <th className="text-right p-4 font-semibold text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-muted">No jobs yet. Click &quot;Add Job&quot; to create one.</td></tr>
                ) : jobs.map((job) => (
                  <tr key={job.id} className="border-b border-border/30 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-text">{job.title}</td>
                    <td className="p-4 text-muted hidden sm:table-cell">{job.company}</td>
                    <td className="p-4 hidden md:table-cell"><span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">{job.category}</span></td>
                    <td className="p-4 text-muted hidden lg:table-cell">{formatDate(job.createdAt)}</td>
                    <td className="p-4 text-center">
                      <button onClick={() => handleToggleActive(job)} className={`px-2.5 py-0.5 rounded-full text-xs font-semibold transition ${job.isActive ? "bg-green-50 text-green-700 hover:bg-green-100" : "bg-red-50 text-red-600 hover:bg-red-100"}`}>
                        {job.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => { setEditingJob(job); setModalOpen(true); }} className="p-2 rounded-lg text-muted hover:text-primary hover:bg-primary/10 transition" aria-label="Edit"><Pencil size={16} /></button>
                        <button onClick={() => handleDelete(job)} className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 transition" aria-label="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <JobFormModal isOpen={modalOpen} onClose={() => setModalOpen(false)} job={editingJob} onSave={handleSave} />
    </div>
  );
}
