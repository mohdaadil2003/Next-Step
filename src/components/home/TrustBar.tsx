const TRUST_ITEMS = [
  { label: "Verified Listings" },
  { label: "100% Free for Students" },
  { label: "Fresher Friendly" },
  { label: "Direct Recruiter Contact" },
  { label: "Pan-India Opportunities" },
];

export default function TrustBar() {
  return (
    <section className="bg-white py-5 px-4 border-b border-border" aria-label="Platform features">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
        {TRUST_ITEMS.map((item) => (
          <p
            key={item.label}
            className="flex items-center gap-2 text-sm font-semibold text-muted whitespace-nowrap"
          >
            <span className="text-primary">&#10003;</span>
            {item.label}
          </p>
        ))}
      </div>
    </section>
  );
}
