"use client";

import { useState } from "react";
import Link from "next/link";
import { Send } from "lucide-react";
import toast from "react-hot-toast";
import { CATEGORIES } from "@/lib/constants";

const quickLinks = [
  { href: "/", label: "Browse Jobs" },
  { href: "/resources", label: "Resources" },
  { href: "/consulting", label: "Career Consulting" },
  { href: "/auth/signin", label: "Sign In" },
];

const categories = CATEGORIES.slice(0, 6).map((c) => c.name);

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        toast.success("Subscribed successfully!");
        setEmail("");
      } else {
        const data = await res.json();
        toast.error(data.error || "Subscription failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-[#0F1B2D] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold"
                style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
              >
                NS
              </div>
              <span
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{
                  backgroundImage: "linear-gradient(135deg, #0A66C2, #00AAFF)",
                  fontFamily: "'Clash Display', sans-serif",
                }}
              >
                NEXT STEP
              </span>
            </Link>
            <p className="text-[#8899B0] text-sm leading-relaxed mb-6">
              India&apos;s trusted career platform for fresh graduates. We connect talented freshers
              with top companies hiring entry-level talent.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/80"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-[#8899B0] text-sm hover:text-white hover:pl-1 transition-all duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/80"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Categories
            </h4>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link
                    href={`/?category=${encodeURIComponent(cat)}`}
                    className="text-[#8899B0] text-sm hover:text-white hover:pl-1 transition-all duration-200"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated */}
          <div>
            <h4
              className="text-sm font-semibold uppercase tracking-wider mb-4 text-white/80"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Stay Updated
            </h4>
            <p className="text-[#8899B0] text-sm mb-4">
              Get the latest jobs and career tips delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm placeholder:text-[#8899B0] focus:outline-none focus:border-[#0A66C2] transition"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl text-white flex items-center justify-center transition hover:-translate-y-0.5"
                style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
                aria-label="Subscribe"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[#8899B0] text-sm">
          <span>&copy; {new Date().getFullYear()} NEXT STEP. All rights reserved.</span>
          <span>Made with &#10084;&#65039; for Fresh Graduates</span>
        </div>
      </div>
    </footer>
  );
}
