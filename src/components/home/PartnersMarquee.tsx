import { PARTNER_COMPANIES } from "@/lib/constants";

export default function PartnersMarquee() {
  const doubled = [...PARTNER_COMPANIES, ...PARTNER_COMPANIES];

  return (
    <section className="py-10 bg-white border-b border-border overflow-hidden" aria-label="Trusted by companies">
      <p className="text-center text-xs font-semibold text-muted uppercase tracking-widest mb-5">
        Trusted by hiring teams at
      </p>
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
        <div className="flex gap-12 w-max animate-marquee" aria-hidden="true">
          {doubled.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="text-lg font-bold text-muted/50 whitespace-nowrap hover:text-muted transition-colors"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
