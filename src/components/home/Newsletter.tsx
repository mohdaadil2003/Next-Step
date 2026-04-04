"use client";

import { useState } from "react";

interface NewsletterProps {
  onSubscribe: (email: string) => Promise<void>;
}

export default function Newsletter({ onSubscribe }: NewsletterProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || submitting) return;

    setSubmitting(true);
    try {
      await onSubscribe(email.trim());
      setEmail("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      className="py-16 px-4"
      style={{ background: "linear-gradient(135deg, #EFF6FF, #E0EEFF)" }}
      aria-labelledby="nl-heading"
    >
      <div className="max-w-xl mx-auto text-center">
        <h2
          id="nl-heading"
          className="text-2xl md:text-3xl font-bold mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Never Miss an Opportunity
        </h2>
        <p className="text-muted mb-7">Get the latest jobs delivered to your inbox weekly</p>

        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 max-w-md mx-auto" noValidate>
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input
            id="nl-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            required
            autoComplete="email"
            className="flex-1 min-w-[180px] px-5 py-3 rounded-full border-2 border-border bg-white text-text placeholder:text-muted/60 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
          >
            {submitting ? "Sending..." : "Subscribe"}
          </button>
        </form>
      </div>
    </section>
  );
}
