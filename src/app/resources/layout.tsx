import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Resources",
  description:
    "Free resume templates, cover letter guides, interview preparation tips, LinkedIn optimization checklists, and salary negotiation guides for freshers.",
  openGraph: {
    title: "Career Resources | NEXT STEP",
    description:
      "Free career guides and templates crafted for fresh graduates in India.",
  },
};

export default function ResourcesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
