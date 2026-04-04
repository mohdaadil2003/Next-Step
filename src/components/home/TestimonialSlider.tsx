import { TESTIMONIALS } from "@/lib/constants";

export default function TestimonialSlider() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section
      className="py-20 overflow-hidden"
      style={{ background: "linear-gradient(135deg, #004182, #0A66C2)" }}
      aria-labelledby="stories-heading"
    >
      <div className="text-center mb-10">
        <h2
          id="stories-heading"
          className="text-2xl md:text-3xl font-bold text-white mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Success Stories
        </h2>
        <p className="text-white/75">Real students who found their next step</p>
      </div>

      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to right, #004182, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: "linear-gradient(to left, #0A66C2, transparent)" }} />

        <div
          className="flex gap-5 w-max"
          style={{ animation: "marquee 40s linear infinite" }}
          role="region"
          aria-label="Student testimonials"
        >
          {doubled.map((t, i) => (
            <article
              key={`${t.name}-${i}`}
              className="min-w-[300px] max-w-[340px] rounded-2xl p-6 border border-white/20 backdrop-blur-sm flex-shrink-0"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #00AAFF, #fff)" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/60 text-xs">{t.role}</p>
                </div>
              </div>
              <blockquote className="text-white/90 text-sm leading-relaxed mb-4">
                {t.quote}
              </blockquote>
              <div className="text-amber-400 text-xs mb-2" aria-label={`${t.stars} stars`}>
                {"\u2605".repeat(t.stars)}{"\u2606".repeat(5 - t.stars)}
              </div>
              <p className="text-white/50 text-xs">{t.company}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
