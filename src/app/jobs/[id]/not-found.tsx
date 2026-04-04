import Link from "next/link";

export default function JobNotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-[68px]">
      <p className="text-6xl mb-4">🔍</p>
      <h1 className="text-2xl font-bold text-text mb-2" style={{ fontFamily: "var(--font-display)" }}>
        Job Not Found
      </h1>
      <p className="text-muted text-sm mb-6">This job may have been removed or the link is incorrect.</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
        style={{ background: "linear-gradient(135deg, #0A66C2, #00AAFF)" }}
      >
        ← Back to Jobs
      </Link>
    </div>
  );
}
