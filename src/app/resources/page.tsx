"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { RESOURCE_DATA } from "@/lib/constants";

const RESOURCE_KEYS = Object.keys(RESOURCE_DATA);

function ResourceDetail({ resource, onClose }: { resource: (typeof RESOURCE_DATA)[string]; onClose: () => void }) {
  const [openSection, setOpenSection] = useState(0);

  return (
    <div className="bg-white rounded-2xl border border-border/50 shadow-sm p-6 sm:p-8">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: resource.iconBg }}>
            {resource.icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text">{resource.title}</h2>
            <p className="text-sm text-muted">{resource.subtitle}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-muted hover:text-text transition text-sm font-medium">Close &#10005;</button>
      </div>
      <div className="space-y-3">
        {resource.sections.map((section, idx) => (
          <div key={idx} className="border border-border/50 rounded-xl overflow-hidden">
            <button onClick={() => setOpenSection(openSection === idx ? -1 : idx)} className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition">
              <h3 className="font-semibold text-text">{section.heading}</h3>
              {openSection === idx ? <ChevronUp size={18} className="text-muted flex-shrink-0" /> : <ChevronDown size={18} className="text-muted flex-shrink-0" />}
            </button>
            {openSection === idx && (
              <div className="px-4 pb-4">
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted">
                      <span className="text-primary mt-0.5 flex-shrink-0">&#10003;</span> {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
      {resource.cta && (
        <div className="mt-6 text-center">
          {resource.downloadUrl ? (
            <a
              href={resource.downloadUrl}
              download
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
            >
              {resource.cta}
            </a>
          ) : (
            <button
              onClick={() => window.open("https://www.coursera.org", "_blank", "noopener")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
            >
              {resource.cta} <ArrowRight size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResourcesPage() {
  const [activeResource, setActiveResource] = useState<string | null>(null);

  return (
    <div className="pt-[68px] pb-16 animate-fade-up">
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #F0F4FA, #E8F0FE)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>Career Resources</h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Free guides, templates, and tips to help you land your dream job — crafted specifically for fresh graduates.
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {RESOURCE_KEYS.map((key) => {
            const r = RESOURCE_DATA[key];
            return (
              <button
                key={key}
                onClick={() => setActiveResource(activeResource === key ? null : key)}
                className={`text-left bg-white rounded-2xl border p-6 transition-all hover:-translate-y-1 hover:shadow-md ${activeResource === key ? "border-primary shadow-md" : "border-border/50"}`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: r.iconBg }}>{r.icon}</div>
                <h3 className="text-lg font-bold text-text mb-1">{r.title}</h3>
                <p className="text-sm text-muted">{r.subtitle}</p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-3">
                  {activeResource === key ? "Close" : "Read Guide"} <ArrowRight size={14} />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {activeResource && (
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 animate-fade-up">
          <ResourceDetail resource={RESOURCE_DATA[activeResource]} onClose={() => setActiveResource(null)} />
        </section>
      )}
    </div>
  );
}
