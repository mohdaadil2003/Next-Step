"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Loader2, Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "JOB_SEEKER" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
        return;
      }

      toast.success("Account created! Signing you in...");
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push("/");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[68px] min-h-screen flex items-center justify-center px-4 bg-[#F0F4FA]">
      <div className="w-full max-w-md bg-white rounded-2xl border border-border/50 shadow-sm p-8 animate-fade-up">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <UserPlus size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            Create Account
          </h1>
          <p className="text-muted text-sm mt-1">Join NEXT STEP as a job seeker or employer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="reg-name" className="block text-sm font-medium text-text mb-1.5">Full Name</label>
            <input id="reg-name" name="name" type="text" value={form.name} onChange={handleChange} className="input-field" placeholder="John Doe" autoComplete="name" />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-text mb-1.5">Email</label>
            <input id="reg-email" name="email" type="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" autoComplete="email" />
          </div>
          <div>
            <label htmlFor="reg-pw" className="block text-sm font-medium text-text mb-1.5">Password</label>
            <div className="relative">
              <input id="reg-pw" name="password" type={showPw ? "text" : "password"} value={form.password} onChange={handleChange} className="input-field pr-11" placeholder="Min 8 chars, 1 uppercase, 1 number" autoComplete="new-password" />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text transition">
                {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="reg-role" className="block text-sm font-medium text-text mb-1.5">I am a</label>
            <select id="reg-role" name="role" value={form.role} onChange={handleChange} className="input-field">
              <option value="JOB_SEEKER">Job Seeker</option>
              <option value="EMPLOYER">Employer</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full btn-primary flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <Link href="/auth/signin" className="text-primary font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
