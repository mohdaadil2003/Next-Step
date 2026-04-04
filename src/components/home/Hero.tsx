"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const HERO_STATS = [
  { label: "Active Jobs", value: 500 },
  { label: "Students Helped", value: 500, suffix: "+" },
  { label: "Companies", value: 50, suffix: "+" },
  { label: "Success Rate", value: 95, suffix: "%" },
];

const FLOAT_CARDS = [
  {
    initials: "IN",
    bg: "linear-gradient(135deg,#0A66C2,#004182)",
    title: "Product Manager",
    company: "TechCorp India",
    tags: [
      { label: "Remote", color: "#DBEAFE", text: "#1D4ED8" },
      { label: "\u20B98L/yr", color: "#D1FAE5", text: "#059669" },
      { label: "Fresher OK", color: "#FEF3C7", text: "#D97706" },
    ],
  },
  {
    initials: "MK",
    bg: "linear-gradient(135deg,#E91E63,#9C27B0)",
    title: "Digital Marketing",
    company: "StartupXYZ",
    tags: [
      { label: "Hybrid", color: "#DBEAFE", text: "#1D4ED8" },
      { label: "\u20B94L/yr", color: "#D1FAE5", text: "#059669" },
    ],
  },
];

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return <>{count}{suffix}</>;
}

function FloatJobCard({ initials, bg, title, company, tags }: (typeof FLOAT_CARDS)[number]) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 w-64 border border-border/50">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-xs font-bold"
          style={{ background: bg }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-bold text-text">{title}</p>
          <p className="text-xs text-muted">{company}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <span
            key={tag.label}
            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
            style={{ backgroundColor: tag.color, color: tag.text }}
          >
            {tag.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #F0F4FA 0%, #E8F0FE 50%, #EFF6FF 100%)",
      }}
      aria-labelledby="hero-heading"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5" />
        <div className="absolute -bottom-60 -left-40 w-[500px] h-[500px] rounded-full bg-accent/5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-border shadow-sm mb-6 text-sm font-semibold text-muted">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
              </span>
              &#127891; Platform for Fresh Graduates
            </div>

            <h1
              id="hero-heading"
              className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-tight mb-6"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Your{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
              >
                Next Step
              </span>{" "}
              to a Dream Career Starts Here
            </h1>

            <p className="text-lg text-muted max-w-lg mb-8 leading-relaxed">
              Discover curated job opportunities, internships & career resources
              exclusively for recent graduates. No experience needed — just ambition.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <a
                href="#jobs-section"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
                style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
              >
                Browse Opportunities
              </a>
              <Link
                href="/consulting"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all"
              >
                Career Consulting
              </Link>
            </div>

            <div className="flex flex-wrap gap-7" role="list" aria-label="Platform statistics">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} role="listitem" className="text-center">
                  <p
                    className="text-2xl font-bold text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <AnimatedNumber target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-muted font-medium mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:block relative h-[480px]" aria-hidden="true">
            <div className="absolute top-8 right-0 animate-float">
              <FloatJobCard {...FLOAT_CARDS[0]} />
            </div>
            <div className="absolute top-52 left-4 animate-float-delayed">
              <FloatJobCard {...FLOAT_CARDS[1]} />
            </div>
            <div className="absolute bottom-12 right-12 bg-white rounded-2xl shadow-lg p-4 animate-float">
              <p className="text-sm font-bold text-green-600 mb-0.5">&#10003; 12 New Today</p>
              <p className="text-xs text-muted">Jobs just posted</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
