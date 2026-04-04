const STEPS = [
  { number: 1, title: "Create Profile", description: "Sign up and tell us about your skills, education, and career goals." },
  { number: 2, title: "Browse Opportunities", description: "Explore curated jobs and internships matched to your profile." },
  { number: 3, title: "Apply with Confidence", description: "Use our resources to craft the perfect resume and cover letter." },
  { number: 4, title: "Get Hired", description: "Ace the interview with our prep guides and land your first role." },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white" aria-labelledby="hiw-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            id="hiw-heading"
            className="text-2xl md:text-3xl font-bold mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How It Works
          </h2>
          <p className="text-muted">Land your dream job in 4 simple steps</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map((step, idx) => (
            <div
              key={step.number}
              className="relative text-center p-8 rounded-2xl bg-[#F0F4FA] border border-border/50 hover:-translate-y-1.5 transition-transform group"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold mx-auto mb-5"
                style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
              >
                {step.number}
              </div>
              <h3 className="text-lg font-bold text-text mb-2">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.description}</p>
              {idx < STEPS.length - 1 && (
                <div
                  className="hidden lg:block absolute top-12 -right-3 w-6 h-0.5 bg-border"
                  aria-hidden="true"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
